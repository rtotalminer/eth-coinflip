from PIL import Image, ImageDraw, ImageOps
import os
import random
import time
import math

def create_spinning_top_animation(input_image_path, output_folder="frames", num_frames=36, frame_rate=24):
    # Load the coin image
    coin_image = Image.open(input_image_path)
    coin_width, coin_height = coin_image.size

    # Create output folder if it doesn't exist
    os.makedirs(output_folder, exist_ok=True)

    # Calculate rotation step for a full rotation
    rotation_step = 360 / num_frames

    # Generate a series of rotated images for the spinning top effect
    for frame in range(num_frames):
        rotated_image = create_spinning_top_image(coin_image, frame * rotation_step)
        rotated_image.save(os.path.join(output_folder, f"frame_{frame:03d}.png"))

    print(f"Spinning top animation frames saved in '{output_folder}'")

    # Optional: Convert frames to a video using FFMPEG
    convert_to_video(output_folder, frame_rate)

def create_spinning_top_image(coin_image, angle):
    # Create a blank image to draw the spinning top
    spinning_top_image = Image.new("RGBA", coin_image.size, (255, 255, 255, 0))

    # Apply rotation using shearing
    sheared_image = coin_image.transform(
        coin_image.size,
        Image.AFFINE,
        (
            1, math.tan(math.radians(angle)), 0,  # x shear
            0, 1, 0  # y shear
        ),
        Image.BICUBIC
    )

    # Center the sheared coin on the blank image
    offset_x = (spinning_top_image.width - sheared_image.width) // 2
    offset_y = (spinning_top_image.height - sheared_image.height) // 2
    spinning_top_image.paste(sheared_image, (offset_x, offset_y), sheared_image)

    return spinning_top_image

def convert_to_video(frames_folder, frame_rate=24, output_video="output.mp4"):
    # Use FFMPEG to convert frames to video
    ffmpeg_command = (
        f'ffmpeg -framerate {frame_rate} -i "{os.path.join(frames_folder, "frame_%03d.png")}"'
        f' -c:v libx264 -r {frame_rate} -pix_fmt yuv420p "{output_video}"'
    )
    os.system(ffmpeg_command)
    print(f"Spinning top animation video saved as '{output_video}' to {frames_folder}")

if __name__ == "__main__":
    # Specify the input image path
    input_image_path = "./src/assets/img/goldcoin.png"

    # Specify the output folder for frames
    folder = f'{int(time.time())}_{random.getrandbits(32):06x}'
    output_folder = f"./frames/{folder}"

    # Specify the number of frames for a full rotation
    num_frames = 36

    # Specify the frame rate for the video (frames per second)
    frame_rate = 24

    # Create spinning top animation
    create_spinning_top_animation(input_image_path, output_folder, num_frames, frame_rate)
