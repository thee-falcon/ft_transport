import neat
import graphviz

def draw_net(config, genome, filename="network"):
    dot = graphviz.Digraph(format="png")
    
    # Get node genes (input, hidden, output)
    for node in genome.nodes:
        node_type = "input" if node in config.genome_config.input_keys else (
            "output" if node in config.genome_config.output_keys else "hidden"
        )
        dot.node(str(node), node_type)

    # Get connections
    for conn in genome.connections.values():
        if conn.enabled:
            dot.edge(str(conn.key[0]), str(conn.key[1]), label=f"{conn.weight:.2f}")

    dot.render(filename, view=True)

# Load config and create a sample genome
config_path = "./config.txt"
config = neat.Config(neat.DefaultGenome, neat.DefaultReproduction,
                     neat.DefaultSpeciesSet, neat.DefaultStagnation, config_path)

# Create a test genome (you can replace this with an actual one from training)
genome = neat.DefaultGenome(0)
genome.configure_new(config.genome_config)

# Visualize the network
draw_net(config, genome)
