import Invoke from "./OpenAI"
import ChatInput from "./ChatInput";
import "./App.css";

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
    const result = await Invoke(message);

    let div = document.createElement('div');
    let text = document.createTextNode(result);
    div.appendChild(text);
    document.body.append(div);
}

export default App;
