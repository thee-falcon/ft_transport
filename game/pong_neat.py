import neat
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import os

CONFIG_TEXT = '''[NEAT]
fitness_criterion     = max
fitness_threshold     = 400
pop_size              = 50
reset_on_extinction   = False

[DefaultStagnation]
species_fitness_func = max
max_stagnation       = 20
species_elitism      = 2

[DefaultReproduction]
elitism            = 2
survival_threshold = 0.2

[DefaultGenome]
# node activation options
activation_default      = relu
activation_mutate_rate  = 1.0
activation_options      = relu

# node aggregation options
aggregation_default     = sum
aggregation_mutate_rate = 0.0
aggregation_options     = sum

# node bias options
bias_init_mean          = 3.0
bias_init_stdev         = 1.0
bias_max_value          = 30.0
bias_min_value          = -30.0
bias_mutate_power       = 0.5
bias_mutate_rate        = 0.7
bias_replace_rate       = 0.1

# genome compatibility options
compatibility_disjoint_coefficient = 1.0
compatibility_weight_coefficient   = 0.5

# connection add/remove rates
conn_add_prob           = 0.5
conn_delete_prob        = 0.5

# connection enable options
enabled_default         = True
enabled_mutate_rate     = 0.01

feed_forward            = True
initial_connection      = full_direct

# node add/remove rates
node_add_prob           = 0.2
node_delete_prob        = 0.2

# network parameters
num_hidden              = 2
num_inputs              = 3
num_outputs             = 3

# node response options
response_init_mean      = 1.0
response_init_stdev     = 0.0
response_max_value      = 30.0
response_min_value      = -30.0
response_mutate_power   = 0.0
response_mutate_rate    = 0.0
response_replace_rate   = 0.0

# connection weight options
weight_init_mean        = 0.0
weight_init_stdev       = 1.0
weight_max_value        = 30
weight_min_value        = -30
weight_mutate_power     = 0.5
weight_mutate_rate      = 0.8
weight_replace_rate     = 0.1

[DefaultSpeciesSet]
compatibility_threshold = 3.0'''

def create_config():
    with open('config.txt', 'w', newline='\n') as f:
        f.write(CONFIG_TEXT)

class PongAI:
    def __init__(self):
        # Create config file if it doesn't exist
        create_config()
            
        # Load NEAT configuration
        self.config = neat.Config(
            neat.DefaultGenome,
            neat.DefaultReproduction,
            neat.DefaultSpeciesSet,
            neat.DefaultStagnation,
            'config.txt'
        )
        
        # Create population
        self.population = neat.Population(self.config)
        
        # Add reporters
        self.population.add_reporter(neat.StdOutReporter(True))
        self.stats = neat.StatisticsReporter()
        self.population.add_reporter(self.stats)
        
        self.best_genome = None
        self.current_genome = None
        self.current_net = None
        self.generation = 0
        
    def get_action(self, game_state):
        if self.current_net is None:
            return 0
            
        # Normalize inputs
        inputs = (
            game_state['ballY'] / game_state['canvasHeight'],
            game_state['ballX'] / game_state['canvasWidth'],
            game_state['paddleY'] / game_state['canvasHeight']
        )
        
        # Get network output
        output = self.current_net.activate(inputs)[0]
        
        # Convert output to action (-1 for up, 1 for down)
        return -1 if output < 0 else 1
        
    def update_fitness(self, fitness):
        if self.current_genome:
            self.current_genome.fitness = fitness
            
    def eval_genomes(self, genomes, config):
        """Evaluate all genomes and track the best one"""
        for genome_id, genome in genomes:
            self.current_genome = genome
            self.current_net = neat.nn.FeedForwardNetwork.create(genome, config)
            genome.fitness = 0  # Start with fitness 0
            
class PongServer(BaseHTTPRequestHandler):
    ai = PongAI()
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        
        response = {}
        
        if data['type'] == 'get_action':
            action = self.ai.get_action(data['state'])
            response = {'action': action}
        elif data['type'] == 'update_fitness':
            self.ai.update_fitness(data['fitness'])
            response = {'status': 'ok'}
            
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, PongServer)
    print('Starting server on port 8000...')
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()