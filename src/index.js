import React from "react";
import ReactDom from "react-dom/client";
import "./index.css";

// TODO: Solve Warning
// eslint-disable-next-line no-unused-vars
const pizzaData = [
    {
        name: "Focaccia",
        ingredients: "Bread with italian olive oil and rosemary.",
        price: 6,
        photoName: "pizzas/focaccia.jpg",
        soldOut: false,
    },
    {
        name: "Pizza Margherita",
        ingredients: "Tomato and mozarella.",
        price: 10,
        photoName: "pizzas/margherita.jpg",
        soldOut: false,
    },
    {
        name: "Pizza Spinaci",
        ingredients: "Tomato, mozarella, spinach and ricotta cheese.",
        price: 12,
        photoName: "pizzas/spinaci.jpg",
        soldOut: false,
    },
    {
        name: "Pizza Funghi",
        ingredients: "Tomato, mozarella, mushrooms and onion.",
        price: 12,
        photoName: "pizzas/funghi.jpg",
        soldOut: false,
    },
    {
        name: "Pizza Salamino",
        ingredients: "Tomato, mozarella and pepperoni.",
        price: 15,
        photoName: "pizzas/salamino.jpg",
        soldOut: true,
    },
    {
        name: "Pizza Prosciutto",
        ingredients: "Tomato, mozarella, ham, aragula and burrata cheese.",
        price: 18,
        photoName: "pizzas/prosciutto.jpg",
        soldOut: false,
    },
];


function App() {
    return (
        <div className="container">
            <Header />
            <Menu />
            <Footer />
        </div>
    );
}

function Header() {
    return (
        <header className="header">
            <h1>SLICE DELIGHT</h1>
        </header>
    );
}

function Menu() {
    return (
        <main className="menu">
            <h2>Our menu</h2>
            <Pizza name="Focaccia" ingredients="Bread with italian olive oil and rosemary." photoName="pizzas/focaccia.jpg" price={6} />
            <Pizza name="Pizza Margherita" ingredients="Tomato and mozarella." photoName="pizzas/margherita.jpg" price={10} />
            <Pizza name="Pizza Spinaci" ingredients="Tomato, mozarella, spinach and ricotta cheese." photoName="pizzas/spinaci.jpg" price={12} />
            <Pizza name="Pizza Funghi" ingredients="Tomato, mozarella, mushrooms and onion." photoName="pizzas/funghi.jpg" price={12} />
            <Pizza name="Pizza Salamino" ingredients="Tomato, mozarella and pepperoni." photoName="pizzas/salamino.jpg" price={15} />
            <Pizza name="Pizza Prosciutto" ingredients="Tomato, mozarella, ham, aragula and burrata cheese." photoName="pizzas/prosciutto.jpg" price={18} />
        </main>
    );
}

function Pizza(props) {
    return (
        <div className="pizza">
            <img src={props.photoName} alt={props.name}></img>
            <div>
                <h3>{props.name}</h3>
                <p>{props.ingredients}</p>
                <span>{props.price}</span>
            </div>
        </div>
    );
}

function Footer() {
    const hour = new Date().getHours();
    const openHour = 12;
    const closeHour = 22;
    const isOpen = hour >= openHour && hour <= closeHour;
    const version = require('../package.json').version;

    return (
        <footer className="footer">{hour} H. We're currently {isOpen ? "open" : "closed"}. Slice Delight v{version}</footer>
    );
}

const root = ReactDom.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);