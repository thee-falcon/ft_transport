import pickle
import neat
import os

def analyze_checkpoint(checkpoint_path, config_path):
    """
    Analyze a NEAT checkpoint file to find the best genomes.
    
    Args:
        checkpoint_path: Path to the checkpoint pickle file
        config_path: Path to the NEAT config file
    """
    # Load configuration
    config = neat.Config(
        neat.DefaultGenome,
        neat.DefaultReproduction,
        neat.DefaultSpeciesSet,
        neat.DefaultStagnation,
        config_path
    )
    
    # Load the population from the checkpoint file
    with open(checkpoint_path, 'rb') as f:
        population = pickle.load(f)
    
    # Get all genomes
    genomes = population.population
    
    # Sort genomes by fitness
    sorted_genomes = sorted(
        genomes.items(), 
        key=lambda x: x[1].fitness if x[1].fitness is not None else float('-inf'),
        reverse=True
    )
    
    # Print top 5 genomes
    print("\nTop 5 Genomes:")
    print("ID\t\tFitness")
    print("-" * 20)
    for genome_id, genome in sorted_genomes[:10]:
        print(f"{genome_id}\t\t{genome.fitness:.2f}")
    
    # Get the best genome
    best_genome_id, best_genome = sorted_genomes[0]
    
    print(f"\nBest Genome Details:")
    print(f"ID: {best_genome_id}")
    print(f"Fitness: {best_genome.fitness:.2f}")
    print(f"Number of nodes: {len(best_genome.nodes)}")
    print(f"Number of connections: {len(best_genome.connections)}")
    
    return best_genome, config

if __name__ == "__main__":
    checkpoint_path = os.path.join('checkpoints', 'checkpoint.pkl')
    config_path = 'config.txt'
    
    try:
        best_genome, config = analyze_checkpoint(checkpoint_path, config_path)
        
        # Create a neural network from the best genome
        net = neat.nn.FeedForwardNetwork.create(best_genome, config)
        print("\nSuccessfully created neural network from best genome!")
        
        # You can now use this network to play Pong
        # Example input: (ballY, ballX, paddleY, ballSpeedX, ballSpeedY)
        sample_input = (100, 120, 100, 8, 8)  # Center positions
        output = net.activate(sample_input)
        print(f"\nSample prediction for centered positions:")
        print(f"Stay: {output[0]:.3f}")
        print(f"Up: {output[1]:.3f}")
        print(f"Down: {output[2]:.3f}")
        
    except Exception as e:
        print(f"Error analyzing checkpoint: {e}")