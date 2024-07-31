// import logo from './logo.svg';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Import Components, styles, media
import GlobalNav from './components/GlobalNav';
import './App.css';

// Import pages
import HomePage from './pages/HomePage';
import PlanTripPage from './pages/PlanTripPage';
import MyTripPage from './pages/MyTripPage';
import SavedTripsPage from './pages/SavedTripsPage';

function App() {
  return (
    <BrowserRouter>
        <header>
            <GlobalNav />
            <h1>
                Jetlagged Adventures
            </h1>
          </header>

        <main>
            <section>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/trip-planner" element={<PlanTripPage />} />
                    <Route path="/my-trip" element={<MyTripPage />} />
                    <Route path="/saved-trips" element={<SavedTripsPage />} />
                </Routes>
            </section>
        </main>

        <footer>
            <p>&copy; 2024, Ethan David Lee</p>
        </footer>

    </BrowserRouter>
  );
}

export default App;
