import re

file_path = r'c:\Users\nabil\OneDrive\Bureau\STAGE NABIL ASAD\site la  reinette\site  la reinette\LaReinette-\src\components\Hero.jsx'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the text
old_text = "Nous offrons l'indépendance et la tranquillité d'esprit dont les seniors ont besoin au quotidien."
new_text = "Un service de transport dédié aux Réginaburgiens et Réginaburgiennes pour vos sorties. Nous offrons l'indépendance et la tranquillité d'esprit dont les seniors ont besoin au quotidien."

content = content.replace(old_text, new_text)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("File updated successfully")
