import Invoke from "./OpenAI"
import ChatInput from "./ChatInput";
import "./App.css";
import mbtiDatabase from "./tools/mbti";

const mbtiDB = new mbtiDatabase();

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ChatInput onSendMessage={(message) => Submit(message)} />
      </header>
    </div>
  );
}

async function Submit(message) {
    const config = {
      thread_id: "test",
      db: mbtiDB
    };
    const result = await Invoke(message, config);

    let div = document.createElement('div');
    let text = document.createTextNode(result);
    div.appendChild(text);
    document.body.append(div);
}

export default App;
