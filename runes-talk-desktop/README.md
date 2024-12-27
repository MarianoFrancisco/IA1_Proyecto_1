# Guide to Set Up and Run the Project

## Create a Virtual Environment:

```bash
python -m venv env
source env/bin/activate  # On Windows: env\\Scripts\\activate
```

## Install Dependencies:

```bash
pip install -r requirements.txt
```

## Run the Application:

```bash
python main.py
```
## Create an Executable Linux (Optional):

```bash
pyinstaller --onefile --windowed --name=RunesTalk --add-data=assets:assets main.py
```


## Create an Executable Windows (Optional):

```bash
pyinstaller --onefile --windowed --name=RunesTalk --add-data=assets;assets main.py
```

