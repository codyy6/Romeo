import React, { useState, useEffect } from "react";
import Wheel from "./Wheel";
import restaurantData from "./restaurant.json";

function Home() {
    const [spinning, setSpinning] = useState(false);
    const [winners, setWinners] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [items, setItems] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [wheelColor, setWheelColor] = useState(
        window.localStorage.getItem("wheelColor") || "#E50303"
    );
    const [fontColor, setFontColor] = useState(
        window.localStorage.getItem("fontColor") || "#FFFFFF"
    );

    // Handle checkbox toggling
    const handleCategoryChange = (category) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(category)
                ? prevSelected.filter((c) => c !== category)
                : [...prevSelected, category]
        );
    };

    // Filter items based on selected categories
    useEffect(() => {
        if (selectedCategories.length === 0) {
            // Show all items if no category is selected
            setItems(restaurantData.items.map((item) => item.name));
        } else {
            // Show items that belong to all selected categories
            const filteredItems = restaurantData.items.filter((item) =>
                selectedCategories.every((category) =>
                    restaurantData.categories
                        .find((cat) => cat.category === category)
                        .itemIds.includes(item.id)
                )
            );
            setItems(filteredItems.map((item) => item.name));
        }
    }, [selectedCategories]);

    const selectResultEventHandler = (data) => {
        if (items.length > 0 && !spinning) {
            setSpinning(true);
            const selectedIndex = data;

            setTimeout(() => {
                setSpinning(false);
                setWinners([...winners, items[selectedIndex]]);
                setOpenModal(true);
            }, window.localStorage.getItem("duration") * 1000);
        }
    };

    let newWinnerIndex = winners.length - 1;

    return (
        <section className="relative min-h-screen flex justify-center items-center bg-cyan-200">
            <div>
                <h2>Category</h2>
                <ul>
                    {restaurantData.categories.map((category, index) => (
                        <li key={index}>
                            <label>
                                <input
                                    type="checkbox"
                                    onChange={() =>
                                        handleCategoryChange(category.category)
                                    }
                                    checked={selectedCategories.includes(
                                        category.category
                                    )}
                                />
                                {category.category}
                            </label>
                        </li>
                    ))}
                </ul>
            </div>
            <Wheel
                items={items}
                onChange={selectResultEventHandler}
                spinning={spinning}
                wheelColor={wheelColor}
                fontColor={fontColor}
            />
            {openModal && (
                <div className="p-10 bg-gradient-to-t from-green-600 to-green-400 rounded-md text-center">
                    <h1
                        style={{ color: "#E50303" }}
                        className="text-xl font-bold"
                    >
                        Congratulations you won a lottery!!!
                    </h1>
                    <p>{winners[newWinnerIndex]}</p>
                </div>
            )}
        </section>
    );
}

export default Home;
