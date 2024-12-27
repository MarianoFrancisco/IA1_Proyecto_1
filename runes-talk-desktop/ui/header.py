import tkinter as tk
from PIL import Image, ImageTk
from logic.handlers.resource_path_handler import ResourcePathHandler


class Header:
    def __init__(self, parent):
        self.frame = tk.Frame(parent, bg="#2c2c2c")
        self.frame.pack(pady=10, padx=10, fill=tk.X)

        self.left_container = tk.Frame(self.frame, bg="#2c2c2c")
        self.left_container.pack(side=tk.LEFT)

        self.right_container = tk.Frame(self.frame, bg="#2c2c2c")
        self.right_container.pack(side=tk.RIGHT)

        try:
            image_path = ResourcePathHandler.get_resource_path("assets/runes-talk-icon.png")

            image = Image.open(image_path)

            max_width, max_height = 80, 80
            image.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)

            self.logo_image = ImageTk.PhotoImage(image)

            self.logo_label = tk.Label(self.left_container, image=self.logo_image, bg="#2c2c2c")
            self.logo_label.pack(side=tk.LEFT, padx=10)

        except Exception as e:
            print(f"Error al cargar el logo: {e}")
            self.logo_label = tk.Label(
                self.left_container,
                text="RunesTalk",
                font=("Arial", 24, "bold"),
                bg="#2c2c2c",
                fg="white",
            )
            self.logo_label.pack(side=tk.LEFT, padx=10)

        self.title_label = tk.Label(
            self.left_container,
            text="RunesTalk",
            font=("Arial", 24, "bold"),
            bg="#2c2c2c",
            fg="white",
        )
        self.title_label.pack(side=tk.LEFT, padx=10)

        self.exit_button = tk.Button(
            self.right_container,
            text="X",
            font=("Arial", 14, "bold"),
            bg="#ff5c5c",
            fg="white",
            bd=0,
            relief=tk.FLAT,
            command=parent.quit,
        )
        self.exit_button.pack(side=tk.RIGHT, padx=10)
