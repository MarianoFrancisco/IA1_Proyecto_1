import tkinter as tk
import time

class ChatDisplay:
    def __init__(self, parent):
        self.text_widget = tk.Text(
            parent,
            bg="#2c2c2c",
            fg="white",
            font=("Arial", 12),
            state=tk.DISABLED,
            wrap=tk.WORD,
            padx=10,
            pady=10,
            borderwidth=0,
            highlightthickness=0
        )
        self.text_widget.pack(padx=10, pady=10, fill=tk.BOTH, expand=True)

    def add_message(self, message, align="left", color="#ffffff", bubble_color=None):
        self.text_widget.config(state=tk.NORMAL)
        tag_name = f"bubble_{align}"

        if tag_name not in self.text_widget.tag_names():
            if bubble_color:
                self.text_widget.tag_configure(
                    tag_name,
                    justify=align,
                    background=bubble_color,
                    foreground=color,
                    lmargin1=300 if align == "right" else 10,
                    rmargin=10 if align == "right" else 300,
                    spacing1=5,
                    spacing3=5,
                    relief="flat",
                )
            else:
                self.text_widget.tag_configure(
                    tag_name,
                    justify=align,
                    foreground=color,
                    lmargin1=10 if align == "left" else 100,
                    rmargin=10 if align == "right" else 100,
                    spacing1=5,
                    spacing3=5,
                )

        self.text_widget.insert(tk.END, f"{message}\n", tag_name)
        self.text_widget.config(state=tk.DISABLED)
        self.text_widget.see(tk.END)

    def add_message_slowly(self, message, align="left", color="#ffffff", bubble_color=None, on_complete=None):
        self.text_widget.config(state=tk.NORMAL)
        tag_name = f"bubble_{align}"

        if tag_name not in self.text_widget.tag_names():
            if bubble_color:
                self.text_widget.tag_configure(
                    tag_name,
                    justify=align,
                    background=bubble_color,
                    foreground=color,
                    lmargin1=100 if align == "right" else 10,
                    rmargin=10 if align == "right" else 100,
                    spacing1=5,
                    spacing3=5,
                    relief="flat",
                )
            else:
                self.text_widget.tag_configure(
                    tag_name,
                    justify=align,
                    foreground=color,
                    lmargin1=10 if align == "left" else 100,
                    rmargin=10 if align == "right" else 100,
                    spacing1=5,
                    spacing3=5,
                )

        for char in message:
            self.text_widget.insert(tk.END, char, tag_name)
            self.text_widget.update()
            self.text_widget.see(tk.END)
            time.sleep(0.001)

        self.text_widget.insert(tk.END, "\n", tag_name)
        self.text_widget.config(state=tk.DISABLED)

        if on_complete:
            on_complete()

    def clear_chat(self):
        self.text_widget.config(state=tk.NORMAL)
        self.text_widget.delete(1.0, tk.END)
        self.text_widget.config(state=tk.DISABLED)
