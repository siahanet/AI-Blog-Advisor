import { Chat } from './components/Chat';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 md:py-12">
      <div className="max-w-6xl mx-auto h-[calc(100vh-4rem)] md:h-[calc(100vh-6rem)]">
        <Chat />
      </div>
    </div>
  );
}
