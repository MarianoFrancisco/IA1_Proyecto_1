import tkinter as tk
import threading
from ui.header import Header
from ui.chat_display import ChatDisplay
from ui.input_area import InputArea
from logic.ai_logic import AILogic


class RunesTalkApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Runes Talk")
        self.root.geometry("800x600")
        self.root.configure(bg="#2c2c2c")

        self.root.attributes("-fullscreen", True)

        self.header = Header(self.root)
        self.chat_display = ChatDisplay(self.root)
        self.input_area = InputArea(
            self.root, self.send_message, self.clear_messages
        )

    def send_message(self):
        user_message = self.input_area.get_user_input()
        if not user_message:
            return

        self.input_area.clear_input()

        self.input_area.lock_input()

        self.chat_display.add_message(user_message, align="right", color="#ffffff", bubble_color="#3e3e3e")

        threading.Thread(target=self.generate_ai_response, args=(user_message,)).start()


    def generate_ai_response(self, user_message):
        ai_response = AILogic.get_ai_response(user_message)

        self.chat_display.add_message_slowly(
            ai_response,
            align="left",
            color="#ffffff",
            bubble_color=None,
            on_complete=self.input_area.unlock_input
        )

    def clear_messages(self):
        self.chat_display.clear_chat()


if __name__ == "__main__":
    root = tk.Tk()
    app = RunesTalkApp(root)
    root.mainloop()
