import React, { useState, useRef } from "react";

function App() {
    const [storedText, setStoredText] = useState("");
    const [parsedData, setParsedData] = useState(null);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const [isListening, setIsListening] = useState(false);
    const [totalCost, setTotalCost] = useState(0);

    const recognitionRef = useRef(null);

    const startListening = () => {
        if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
            alert("Speech Recognition API is not supported in this browser.");
            return;
        }

        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = "en-US";

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event) => {
            const transcript = Array.from(event.results)
                .map((result) => result[0].transcript)
                .join(" ");
            setStoredText(transcript);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.error("Speech recognition error:", event.error);
            setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
        setIsListening(false);
    };

    const storeText = async () => {
        try {
            const response = await fetch("http://localhost:5000/store", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text: storedText }),
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error("Error storing text:", error);
        }
    };

    const parseText = async () => {
        try {
            const response = await fetch("http://localhost:5000/parse", {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            const data = await response.json();

            if (data.error) {
                setError(data.error);
                throw new Error(data.error);
            }

            const randomCosts = data.medicines.map(() =>
                Math.floor(Math.random() * 100) + 50
            );

            const updatedData = {
                ...data,
                cost: randomCosts,
            };

            setParsedData(updatedData);

            const total = randomCosts.reduce((sum, cost) => sum + cost, 0);
            setTotalCost(total);

            setError(null);
        } catch (error) {
            console.error("Error parsing text:", error);
            setError("Failed to parse text.");
        }
    };

    const downloadCSV = () => {
        if (!parsedData) return;

        const rows = [
            ["Medicine", "Dosage", "Frequency", "Duration", "Cost"],
            ...parsedData.medicines.map((_, index) => [
                parsedData.medicines[index] || "None",
                parsedData.dosage[index] || "None",
                parsedData.frequency[index] || "None",
                parsedData.duration[index] || "None",
                parsedData.cost[index],
            ]),
            ["", "", "", "Total Cost", totalCost],
        ];

        const csvContent = rows.map((row) => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "pharmacy_data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div>
            <style>
                {`
                    body {
                        background: linear-gradient(135deg, #4285F4, #EA4335, #FBBC05, #34A853);
                        background-size: 400% 400%;
                        animation: gradient-animation 15s ease infinite;
                        font-family: Arial, sans-serif;
                        margin: 0;
                        padding: 0;
                        height: 100vh;
                        color: white;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                    }

                    @keyframes gradient-animation {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }

                    .container {
                        background-color: rgba(213, 242, 244, 0.07);
                        border-radius: 20px;
                        padding: 30px;
                        text-align: center;
                        width: 90%;
                        max-width: 800px;
                        height: 90%;
                        overflow-y: auto;
                        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
                    }

                    h1 {
                        color: #FBBC05; /* Google Yellow */
                        margin-bottom: 20px;
                    }

                    textarea {
                        width: 100%;
                        padding: 10px;
                        border: none;
                        border-radius: 10px;
                        margin-bottom: 20px;
                        font-size: 16px;
                        outline: none;
                    }

                    button {
                        border: none;
                        border-radius: 30px;
                        padding: 10px 20px;
                        margin: 5px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s;
                    }

                    button:disabled {
                        background-color: #777;
                        cursor: not-allowed;
                    }

                    button:not(:disabled):hover {
                        transform: scale(1.1);
                    }

                    button:nth-child(1) {
                        background-color: #34A853; /* Google Green */
                        color: white;
                    }

                    button:nth-child(2) {
                        background-color: #EA4335; /* Google Red */
                        color: white;
                    }

                    button:nth-child(3) {
                        background-color: #FBBC05; /* Google Yellow */
                        color: black;
                    }

                    button:nth-child(4) {
                        background-color: #4285F4; /* Google Blue */
                        color: white;
                    }

                    button:nth-child(5) {
                        background-color:rgba(131, 151, 136, 0.43); /* Google Green */
                        color: white;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                    }

                    th, td {
                        padding: 10px;
                        text-align: center;
                    }

                    th {
                        background-color: #FBBC05;
                        color: black;
                        font-weight: bold;
                    }

                    tbody tr:nth-child(even) {
                        background-color: rgba(255, 255, 255, 0.2);
                    }

                    tbody tr:last-child td {
                        font-weight: bold;
                    }
                `}
            </style>
            <div className="container">
                <h1>PharmaSsist</h1>
                <textarea
                    rows="6"
                    placeholder="Enter or speak your text here..."
                    value={storedText}
                    onChange={(e) => setStoredText(e.target.value)}
                />
                <br />
                <button onClick={startListening} disabled={isListening}>
                    Start Listening
                </button>
                <button onClick={stopListening} disabled={!isListening}>
                    Stop Listening
                </button>
                <button onClick={storeText}>Store Text</button>
                <button onClick={parseText}>Parse and Display Data</button>
                <button onClick={downloadCSV} disabled={!parsedData}>
                    Download CSV
                </button>

                {message && <p style={{ color: "#34A853" }}>{message}</p>}
                {error && <p style={{ color: "#EA4335" }}>Error: {error}</p>}

                {parsedData && (
                    <div>
                        <table border="1">
                            <thead>
                                <tr>
                                    <th>Medicine</th>
                                    <th>Dosage</th>
                                    <th>Frequency</th>
                                    <th>Duration</th>
                                    <th>Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                {parsedData.medicines.map((medicine, index) => (
                                    <tr key={index}>
                                        <td>{medicine || "None"}</td>
                                        <td>{parsedData.dosage[index] || "None"}</td>
                                        <td>{parsedData.frequency[index] || "None"}</td>
                                        <td>{parsedData.duration[index] || "None"}</td>
                                        <td>{parsedData.cost[index]}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="4" style={{ textAlign: "right" }}>
                                        Total Cost:
                                    </td>
                                    <td>{totalCost}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
