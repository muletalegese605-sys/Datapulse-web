import sqlite3

def get_db_connection():
    conn = sqlite3.connect('datapulse.db')
    conn.row_factory = sqlite3.Row
    return conn

def search_data(query):
    conn = get_db_connection()
    cursor = conn.cursor()
    # Hubadhu: 'operations' bakka bu'i maqaa table data kee tiin
    cursor.execute("SELECT * FROM operations WHERE name LIKE ?", ('%' + query + '%',))
    results = cursor.fetchall()
    conn.close()
    return [dict(row) for row in results]
