import sqlite3

class MessageModel:
    def __init__(self, room_field, username_field, content_field, time_field):
        self.conn = sqlite3.connect("messages.db")
        self.username = username_field
        self.content = content_field
        self.time = time_field
        self.room = room_field

        try:
            query = f'''CREATE TABLE MESSAGES
                ({self.room}           TEXT    NOT NULL,
                {self.username}           TEXT    NOT NULL,
                {self.content}           TEXT     NOT NULL,
                {self.time}        CHAR(50));'''
            self.conn.execute(query)
        except Exception as e:
            print(e)

    def addData(self, data):
        query = f"INSERT INTO MESSAGES ({self.room}, {self.username}, {self.content}, {self.time}) VALUES {data[self.room], data[self.username], data[self.content], data[self.time]};"
        self.conn.execute(query)
        self.conn.commit()
        
    def getDatabyRoom(self, room):
        query = f"SELECT * from MESSAGES WHERE {self.room} = {room}"
        rows = self.conn.execute(query)

        data = {"username" : [], "content" : [], "time" : []}
        c = 0
        for _, username, content, time in rows:
            data["username"].append(username)
            data["content"].append(content)
            data["time"].append(time)
            c += 1
        data["length"] = c
        return data
    def close(self):
        self.conn.close()