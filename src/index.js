import "./index.css";
import React from "react";
import ReactDom from "react-dom/client";
import PizzaData from "./pizzaData.json";

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
    const pizzas = PizzaData.pizzas;
    const numPizzas = pizzas.length;

    return (
        <main className="menu">
            <h2>Our menu</h2>
            {numPizzas > 0 ? (
                <>
                    <p>Authentic Italian cuisine. 6 creative dishes to choose from. Al from our stone oven, all organic, all delicious.</p>
                    <ul className="pizzas">
                        {pizzas.map((pizza) => (<Pizza pizza={pizza} key={pizza.name} />))}
                    </ul>
                </>
            ) : (
                <p>We're still working on our menu. Please come back later :)</p>
            )}
        </main>
    );
}

function Pizza({ pizza }) {
    return (
        <li className={`pizza ${pizza.soldOut ? "sold-out" : ""}`}>
            <img src={pizza.photoName} alt={pizza.name}></img>
            <div>
                <h3>{pizza.name}</h3>
                <p>{pizza.ingredients}</p>
                {pizza.soldOut ? (
                    <span>SOLD OUT</span>
                ) : (
                    <span>{pizza.price}€</span>
                )}
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
            {isOpen ? (
                <Order closeHour={closeHour} openHour={openHour} />
            ) : (
                <p>We're happy to welcome you between {openHour}:00 and {closeHour}:00.</p>
            )}
        </footer >
    );
}

function Order({ openHour, closeHour }) {
    return (
        <div className="order">
            <p>We're open from {openHour}:00 to {closeHour}:00. Come visit us or order online.</p>
            <button className="btn" onClick={() => alert("We're still working on this feature. Please come back later :)")}>Order</button>
        </div>
    );
}

function VerisonWatermark() {
    const version = require('../package.json').version;

    return (
        <div className="versionWatermark">{version}</div>
    );
}

const root = ReactDom.createRoot(document.getElementById("root"))
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);