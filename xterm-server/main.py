from aiohttp import web
import socketio
import json

sio = socketio.AsyncServer(cors_allowed_origins='*')
app = web.Application()
sio.attach(app)

async def index(request):
    """Serve the client-side application."""
    with open('index.html') as f:
        return web.Response(text=f.read(), content_type='text/html')

@sio.event
def connect(sid, environ):
    print("connect ", sid)

# @sio.event
# async def chat_message(sid, data):
#     print("message ", data)

@sio.event
def disconnect(sid):
    print('disconnect ', sid)

@sio.on("input")
async def echo_input(sid, data):
    print("Server received message", sid, data)
    parsed_data = json.loads(data)
    echo_msg = parsed_data["command"]
    await sio.emit("input-response", echo_msg)

app.router.add_get('/', index)

if __name__ == '__main__':
    web.run_app(app)