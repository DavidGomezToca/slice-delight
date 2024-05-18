import React from "react";
import ReactDom from "react-dom/client";
import "./index.css";

// TODO: Solve Warning
// eslint-disable-next-line no-unused-vars
const pizzaData = [
    {
        id: 0,
        name: "Focaccia",
        ingredients: "Bread with italian olive oil and rosemary.",
        price: 6,
        photoName: "pizzas/focaccia.jpg",
        soldOut: false,
    },
    {
        id: 1,
        name: "Pizza Margherita",
        ingredients: "Tomato and mozarella.",
        price: 10,
        photoName: "pizzas/margherita.jpg",
        soldOut: false,
    },
    {
        id: 2,
        name: "Pizza Spinaci",
        ingredients: "Tomato, mozarella, spinach and ricotta cheese.",
        price: 12,
        photoName: "pizzas/spinaci.jpg",
        soldOut: false,
    },
    {
        id: 3,
        name: "Pizza Funghi",
        ingredients: "Tomato, mozarella, mushrooms and onion.",
        price: 12,
        photoName: "pizzas/funghi.jpg",
        soldOut: false,
    },
    {
        id: 4,
        name: "Pizza Salamino",
        ingredients: "Tomato, mozarella and pepperoni.",
        price: 15,
        photoName: "pizzas/salamino.jpg",
        soldOut: true,
    },
    {
        id: 5,
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
            <VerisonWatermark />
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
    const pizzas = pizzaData;
    const numPizzas = pizzas.length;

    return (
        <main className="menu">
            <h2>Our menu</h2>
            {numPizzas > 0 && <ul className="pizzas">
                {pizzas.map(pizza => <Pizza pizza={pizza} key={pizza.id} />)}
            </ul>};
        </main>
    );
}

function Pizza(props) {
    return (
        <li className="pizza">
            <img src={props.pizza.photoName} alt={props.pizza.name}></img>
            <div>
                <h3>{props.pizza.name}</h3>
                <p>{props.pizza.ingredients}</p>
                <span>Price: {props.pizza.price}€</span>
            </div>
        </li>
    );
}

function Footer() {
    const hour = new Date().getHours();
    const openHour = 12;
    const closeHour = 22;
    const isOpen = hour >= openHour && hour <= closeHour;

    return (
        <footer className="footer">
            {isOpen ?
                (<Order closeHour={closeHour} />
                ) : (
                    <p>We're happy to welcome you between {openHour}:00 and {closeHour}:00.</p>
                )
            }
        </footer >
    );
}

function Order(props) {
    return (
        <div className="order">
            <p>We're open until {props.closeHour}:00. Come visit us or order online.</p>
            <button className="btn">Order</button>
        </div>)
}

function VerisonWatermark() {
    const version = require('../package.json').version;

    return (
        <div className="versionWatermark">{version}</div>
    )
}

const root = ReactDom.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);