import tkinter as tk
from tkinter import messagebox
from PIL import Image, ImageTk
from logic.handlers.resource_path_handler import ResourcePathHandler

class InputArea:
    def __init__(self, parent, send_command, clear_command):
        self.send_command = send_command
        self.clear_command = clear_command

        self.frame = tk.Frame(parent, bg="#2c2c2c")
        self.frame.pack(side=tk.BOTTOM, fill=tk.X, padx=10, pady=10)

        try:
            send_icon_path = ResourcePathHandler.get_resource_path("assets/send.png")
            clear_icon_path = ResourcePathHandler.get_resource_path("assets/clean.png")

            send_icon = Image.open(send_icon_path).resize((24, 24), Image.Resampling.LANCZOS)
            clear_icon = Image.open(clear_icon_path).resize((24, 24), Image.Resampling.LANCZOS)

            self.send_icon_image = ImageTk.PhotoImage(send_icon)
            self.clear_icon_image = ImageTk.PhotoImage(clear_icon)
        except Exception as e:
            print(f"Error al cargar iconos: {e}")
            self.send_icon_image = None
            self.clear_icon_image = None

        self.clear_button = tk.Button(
            self.frame,
            text="",
            font=("Arial", 12, "bold"),
            bg="#ff5c5c",
            fg="white",
            image=self.clear_icon_image,
            compound=tk.LEFT,
            command=self.clear_input_with_validation,
        )
        self.clear_button.pack(side=tk.LEFT, padx=5)

        self.input_field = tk.Entry(
            self.frame,
            bg="#3e3e3e",
            fg="white",
            font=("Arial", 14),
            relief=tk.FLAT,
        )
        self.input_field.pack(side=tk.LEFT, fill=tk.X, expand=True, padx=(5, 5), pady=5)

        self.input_field.bind("<Return>", self.on_enter)

        self.send_button = tk.Button(
            self.frame,
            text="",
            font=("Arial", 12, "bold"),
            bg="#0078d7",
            fg="white",
            image=self.send_icon_image,
            compound=tk.LEFT,
            command=self.send_input_with_validation,
        )
        self.send_button.pack(side=tk.RIGHT, padx=5)

    def send_input_with_validation(self):
        text = self.get_user_input().strip()
        if not text:
            messagebox.showerror("Error", "Debe ingresar un mensaje antes de enviarlo.")
        else:
            self.send_command()
            self.clear_input()

    def clear_input_with_validation(self):
        self.clear_command()
        self.clear_input()

    def on_enter(self, event):
        self.send_input_with_validation()

    def get_user_input(self):
        return self.input_field.get()

    def clear_input(self):
        self.input_field.delete(0, tk.END)

    def lock_input(self):
        self.input_field.config(state=tk.DISABLED)
        self.send_button.config(state=tk.DISABLED)
        self.clear_button.config(state=tk.DISABLED)

    def unlock_input(self):
        self.input_field.config(state=tk.NORMAL)
        self.send_button.config(state=tk.NORMAL)
        self.clear_button.config(state=tk.NORMAL)
        self.input_field.focus()
