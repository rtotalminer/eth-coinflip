import time
from PIL import Image, ImageSequence

def make_gif_transparent(input_gif_path, output_gif_path, transparency):
    # Open the GIF
    gif = Image.open(input_gif_path)

    # Create a list to hold each frame with transparency applied
    frames = []

    # Iterate over each frame in the GIF
    for frame in ImageSequence.Iterator(gif):
        # Convert the frame to RGBA if it's not already in that mode
        frame = frame.convert('RGBA')

        # Create a new frame with the same size and a fully transparent background
        transparent_frame = Image.new('RGBA', frame.size, (0, 0, 0, 0))

        # Blend the original frame onto the transparent frame with the given transparency
        blended_frame = Image.blend(transparent_frame, frame, transparency)

        # Append the blended frame to the list of frames
        frames.append(blended_frame)

    # Save the result as a GIF
    frames[0].save(output_gif_path, save_all=True, append_images=frames[1:], loop=0)

if __name__ == "__main__":
    # Replace 'input.gif' with the path to your input GIF
    input_gif_path = '../src/assets/img/error.gif'

    # Replace 'output.gif' with the desired path for the output GIF
    output_gif_path = f'../src/assets/img/error-{int(time.time())}.gif'

    # Set the transparency value (0 for fully transparent, 1 for fully opaque)
    transparency = 0.5

    make_gif_transparent(input_gif_path, output_gif_path, transparency)
