import neat
import json
from http.server import HTTPServer, BaseHTTPRequestHandler
import os
import numpy as np
import time
import queue
import threading
import pickle

class PongAI:
    def __init__(self):
        # Create directories if they don't exist
        os.makedirs('checkpoints', exist_ok=True)
        
        self.checkpoint_path = os.path.join('checkpoints', 'checkpoint.pkl')
        self.history_path = os.path.join('checkpoints', 'training_history.json')
        
        self.config = neat.Config(
            neat.DefaultGenome,
            neat.DefaultReproduction,
            neat.DefaultSpeciesSet,
            neat.DefaultStagnation,
            'config.txt'
        )
        
        # Try to load existing population
        try:
            with open(self.checkpoint_path, 'rb') as f:
                self.population = pickle.load(f)
                print(f"Loaded existing population from {self.checkpoint_path}")
        except Exception as e:
            print(f"Creating new population. Could not load checkpoint: {e}")
            self.population = neat.Population(self.config)
            
        self.population.add_reporter(neat.StdOutReporter(True))
        self.stats = neat.StatisticsReporter()
        self.population.add_reporter(self.stats)
        
        self.fitness_queue = queue.Queue()
        self.current_genome = None
        self.current_net = None
        self.best_genome = None
        self.is_evaluating = False
        self.current_genome_id = 0
        self.evaluation_time = 10
        self.min_games_required = 1
        
        # Training history
        self.training_history = self.load_training_history()

    def load_training_history(self):
        try:
            with open(self.history_path, 'r') as f:
                history = json.load(f)
                print(f"Loaded training history from {self.history_path}")
                return history
        except Exception as e:
            print(f"Creating new training history. Could not load history: {e}")
            return {'generations': [], 'best_fitness': []}

    def save_training_history(self):
        try:
            with open(self.history_path, 'w') as f:
                json.dump(self.training_history, f)
                print(f"Saved training history to {self.history_path}")
        except Exception as e:
            print(f"Error saving training history: {e}")

    def save_checkpoint(self):
        try:
            with open(self.checkpoint_path, 'wb') as f:
                pickle.dump(self.population, f)
                print(f"Saved population checkpoint to {self.checkpoint_path}")
        except Exception as e:
            print(f"Error saving checkpoint: {e}")

    def calculate_fitness(self, game_data):
        if not game_data:
            return 0.0

        total_fitness = 0.0
        
        for game in game_data:
            game_fitness = 0.0
            
            # Base fitness from successfully hitting the ball
            game_fitness += game['streak'] * 2.0
            
            # Bonus for ball speed handling
            speed_bonus = min(game['ballSpeed'], 20.0) / 20.0
            game_fitness *= (1.0 + speed_bonus)
            
            # Bonus for handling smaller paddle
            paddle_bonus = 1.0 + (1.0 - (game['paddleHeight'] / 200.0))
            game_fitness *= paddle_bonus
            
            # Time survival bonus (even if eventually lost)
            time_bonus = min(game.get('survivalTime', 0), 30) / 30.0  # Cap at 30 seconds
            game_fitness += time_bonus * 5.0
            
            total_fitness += game_fitness

        # Calculate average fitness across all games
        avg_fitness = total_fitness / len(game_data)
        
        # If the last game was lost, apply a penalty but don't completely negate good performance
        if game_data[-1].get('lost', False):
            final_fitness = max(0.1, avg_fitness - 5.0)  # Ensure minimum positive fitness
        else:
            final_fitness = avg_fitness + 2.0  # Bonus for not losing
            
        print(f"Fitness breakdown - Avg: {avg_fitness:.2f}, Final: {final_fitness:.2f}, Games: {len(game_data)}")
        return final_fitness

    def get_action(self, game_state):
        if self.current_net is None:
            return 0
        try:
            inputs = (
                game_state['ballY'] / game_state['canvasHeight'],
                game_state['ballX'] / game_state['canvasWidth'],
                game_state['paddleY'] / game_state['canvasHeight'],
                game_state['ballSpeedX'] / 15,
                game_state['ballSpeedY'] / 15
            )
            # Get three outputs: [stay, up, down]
            outputs = self.current_net.activate(inputs)
            # Find which action has the highest value
            decision = outputs.index(max(outputs))
            
            # Convert decision to paddle movement
            if decision == 1:    # Move up
                return -1
            elif decision == 2:  # Move down
                return 1
            else:               # Stay in place
                return 0
            
        except Exception as e:
            print(f"Error in get_action: {e}")
            return 0

    def update_fitness(self, game_data, genome_id, lost=False):
        if self.is_evaluating and genome_id == self.current_genome_id:
            try:
                fitness = self.calculate_fitness(game_data)
                self.fitness_queue.put((genome_id, fitness, lost))
                print(f"Updated fitness for genome {genome_id}: {fitness:.2f} (lost: {lost})")
            except Exception as e:
                print(f"Error updating fitness: {e}")
                self.fitness_queue.put((genome_id, 0.0, lost))

    def eval_genomes(self, genomes, config):
        best_fitness = -float('inf')
        best_genome = None
        generation_stats = {'generation': len(self.training_history['generations']), 'genomes': []}

        for genome_id, genome in genomes:
            self.is_evaluating = True
            self.current_genome = genome
            self.current_net = neat.nn.FeedForwardNetwork.create(genome, config)
            self.current_genome_id = genome_id
            
            evaluation_start = time.time()
            received_fitness = False
            
            while time.time() - evaluation_start < self.evaluation_time:
                try:
                    if not self.fitness_queue.empty():
                        gid, fitness, lost = self.fitness_queue.get()
                        if gid == genome_id:
                            genome.fitness = float(fitness)
                            received_fitness = True
                            if lost:
                                break
                except Exception as e:
                    print(f"Error processing fitness: {e}")
                time.sleep(0.1)

            if not received_fitness:
                genome.fitness = 0.0

            generation_stats['genomes'].append({
                'id': genome_id,
                'fitness': genome.fitness
            })

            if genome.fitness > best_fitness:
                best_fitness = genome.fitness
                best_genome = genome

            self.is_evaluating = False

        # Update training history
        self.training_history['generations'].append(generation_stats)
        self.training_history['best_fitness'].append(best_fitness)
        
        # Save progress
        self.save_training_history()
        self.save_checkpoint()

        if best_genome:
            self.best_genome = best_genome
            print(f"Generation complete. Best fitness: {best_fitness:.2f}")


class PongServer(BaseHTTPRequestHandler):
    ai = PongAI()

    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.send_header('Access-Control-Max-Age', '86400')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        data = json.loads(post_data.decode('utf-8'))
        response = {}

        if data['type'] == 'get_action':
            action = self.ai.get_action(data['state'])
            response = {
                'action': action,
                'currentGenome': self.ai.current_genome_id
            }
        elif data['type'] == 'update_fitness':
            genome_id = data.get('genomeId', self.ai.current_genome_id)
            lost = data.get('lost', False)  # New flag to indicate if the genome lost
            self.ai.update_fitness(data['fitness'], genome_id, lost)
            response = {
                'status': 'ok',
                'currentGenome': self.ai.current_genome_id
            }

        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(response).encode('utf-8'))

    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        
        try:
            with open(self.path[1:], 'rb') as file:
                file_content = file.read()
            
            self.send_response(200)
            content_types = {
                '.html': 'text/html',
                '.js': 'application/javascript',
                '.css': 'text/css',
                '.png': 'image/png',
                '.jpg': 'image/jpeg',
                '.jpeg': 'image/jpeg'
            }
            
            file_extension = os.path.splitext(self.path)[1]
            content_type = content_types.get(file_extension, 'application/octet-stream')
            
            self.send_header('Content-type', content_type)
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(file_content)
        except FileNotFoundError:
            self.send_response(404)
            self.send_header('Content-type', 'text/html')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(b"File not found")
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'text/html')
            self.send_cors_headers()
            self.end_headers()
            self.wfile.write(f"Internal server error: {str(e)}".encode('utf-8'))

def run_neat(ai):
    ai.population.run(ai.eval_genomes, 100)

def run_server():
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, PongServer)
    print('Starting server on port 8000...')
    
    neat_thread = threading.Thread(target=run_neat, args=(PongServer.ai,))
    neat_thread.daemon = True
    neat_thread.start()
    
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()