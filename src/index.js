import "./index.css";
import React, { useState } from "react";
import Swal from "sweetalert2";
import ReactDom from "react-dom/client";
import PizzaData from "./pizzaData.json";


function App() {
    const initialOrder = new Array(PizzaData.pizzas.length);
    PizzaData.pizzas.forEach(element => {
        initialOrder[element.id] = ([element.name, element.price, 0]);
    });
    const [order, setOrder] = useState(initialOrder);

    return (
        <div className="container">
            <Header />
            <Menu order={order} setOrder={setOrder} />
            <Footer order={order} setOrder={setOrder} />
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

function Menu(order) {
    const pizzas = PizzaData.pizzas;
    const numPizzas = pizzas.length;

    return (
        <main className="menu">
            <h2>Our menu</h2>
            {numPizzas > 0 ? (
                <>
                    <p>Authentic Italian cuisine. 6 creative dishes to choose from. All from our stone oven, all organic, all delicious.</p>
                    <ul className="pizzas">
                        {pizzas.map((pizza) => (<Pizza pizza={pizza} key={pizza.name} order={order} />))}
                    </ul>
                </>
            ) : (
                <p>We're still working on our menu. Please come back later :)</p>
            )}
        </main>
    );
}

function Pizza({ pizza, order }) {
    return (
        <li className={`pizza ${pizza.soldOut ? "sold-out" : ""}`}>
            <img className="pizzaImg" src={pizza.photoName} alt={pizza.name}></img>
            <div className="pizzaDiv">
                <h3>{pizza.name}</h3>
                <p>{pizza.ingredients}</p>
                {pizza.soldOut ? (
                    <span>SOLD OUT</span>
                ) : (
                    <>
                        <div className="orderButtons">
                            <img className={`orderButton ${order.order[pizza.id][2] === 0 ? "orderButtonDisabled" : ""}`} src="ui/minus_button.png" alt="Minus Button" onClick={() => UpdateCantityOrder(pizza.id, -1, order)}></img>
                            <span className="orderCantity">{order.order[pizza.id][2]}</span>
                            <img className="orderButton" src="ui/plus_button.png" alt="Plus Button" onClick={() => UpdateCantityOrder(pizza.id, 1, order)}></img>
                        </div>
                        <span className="pizzaSpan">{pizza.price}€</span>
                    </>
                )}
            </div>
        </li >
    );
}

function UpdateCantityOrder(id, value, order) {
    if (0 <= order.order[id][2] + value) {
        const newOrder = order.order.map((item, index) => {
            if (index === id)
                return [...item.slice(0, 2), item[2] + value, ...item.slice(3)];
            return [...item];
        });
        order.setOrder(newOrder);
    }
}

function Footer(order) {
    const hour = new Date().getHours();
    const openHour = 12;
    const closeHour = 22;
    const isOpen = hour >= openHour && hour <= closeHour;

    return (
        <footer className="footer">
            {isOpen ? (
                <Order closeHour={closeHour} openHour={openHour} order={order} />
            ) : (
                <p>We're happy to welcome you between {openHour}:00 and {closeHour}:00.</p>
            )}
        </footer >
    );
}

function Order({ openHour, closeHour, order }) {

    return (
        <div className="order">
            <p>We're open from {openHour}:00 to {closeHour}:00. Come visit us or order online.</p>
            <button className="btn" onClick={() => {
                let htmlOrder = "";
                let totalPriceInt = 0;
                order.order.forEach(element => {
                    if (element[2] > 0) {
                        htmlOrder = htmlOrder + "<p>" + element[0] + ": " + element[2] + "</p>"
                        totalPriceInt += (element[1] * element[2]);
                    }
                });
                if (totalPriceInt > 0) {
                    const htmlTotalPrice = "Total price: " + totalPriceInt + "€";
                    Swal.fire({
                        title: htmlTotalPrice,
                        html: htmlOrder,
                        icon: "question",
                        showCancelButton: true,
                        confirmButtonColor: "#3085d6",
                        cancelButtonColor: "#d33",
                        confirmButtonText: "Confirm order",
                        customClass: {
                            htmlContainer: "swal-text",
                            confirmButton: "swal-text",
                            cancelButton: "swal-text",
                            popup: "swal-popup"
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            Swal.fire({
                                title: "Order confirmed",
                                text: "Your order will soon be ready.",
                                icon: "success",
                                customClass: {
                                    htmlContainer: "swal-text",
                                    popup: "swal-popup"
                                }
                            });
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Your order is empty.", html: "", icon: "info",
                        customClass: {
                            htmlContainer: "swal-text",
                            confirmButton: "swal-text",
                            popup: "swal-popup"
                        }
                    });
                }
            }}>Order</button>
        </div >
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