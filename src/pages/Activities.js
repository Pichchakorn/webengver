import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Accordion, ListGroup } from "react-bootstrap";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { color, motion } from "framer-motion";


function Activities() {
    const [groupedActivities, setGroupedActivities] = useState({});
    const navigate = useNavigate();

    const lang = localStorage.getItem("lang") || "en";


    useEffect(() => {
        const fetchData = async () => {
            const querySnapshot = await getDocs(collection(db, "activities"));
            const data = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));

            const groupedByCategory = data.reduce((acc, activity) => {
                const category = activity.category || "Category";
                if (!acc[category]) acc[category] = {};
                if (!acc[category][activity.name]) acc[category][activity.name] = [];
                acc[category][activity.name].push(activity);
                return acc;
            }, {});

            setGroupedActivities(groupedByCategory);
        };
        fetchData();
    }, []);

    const handleActivityClick = (name, activities) => {
        navigate(`/activity/${name}`, { state: { activities } });
    };

    return (
            <motion.div 
                className="container mt-5"
                initial={{ opacity: 0, y: 30 }} 
                animate={{ opacity: 1, y: 0 }} 
                transition={{ duration: 0.8, ease: "easeOut" }}>

                <motion.h2 
                    className="text-center mb-4"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, ease: "easeOut" }}
                >
                    🌟 {lang === "th" ? "กิจกรรมที่เราเคยทำ" : "Past Activities We Have Engaged In"} 🌟
                </motion.h2>

                <Accordion defaultActiveKey="0">
                    {Object.keys(groupedActivities).map((category, index) => (
                        <motion.div 
                            key={index}
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ delay: index * 0.15, duration: 0.5, ease: "easeOut" }}
                        >
                            <Accordion.Item eventKey={index.toString()}>
                                <Accordion.Header>{category}</Accordion.Header>
                                <Accordion.Body>
                                    <ListGroup>
                                        {Object.entries(groupedActivities[category]).map(([name, acts]) => {
                                        const first = acts[0]; // กิจกรรมตัวแรกในกลุ่มเดียวกัน
                                        const displayName = lang === "th" ? first.name_th || name : name;

                                        return (
                                            <motion.div
                                            key={name}
                                            whileHover={{ scale: 1.02, rotate: 1 }}
                                            whileTap={{ scale: 0.98 }}
                                            transition={{ type: "spring", stiffness: 150, damping: 10 }}
                                            >
                                            <ListGroup.Item
                                                action
                                                onClick={() => handleActivityClick(name, acts)}
                                                className="shadow-sm p-3 mb-2 rounded"
                                                style={{
                                                cursor: "pointer",
                                                borderRadius: "8px",
                                                fontWeight: "bold",
                                                backgroundColor: "#D6E6FF",
                                                color: "#004085"
                                                }}
                                            >
                                                {displayName}
                                            </ListGroup.Item>
                                            </motion.div>
                                        );
                                        })}
                                    </ListGroup>
                                </Accordion.Body>
                            </Accordion.Item>
                        </motion.div>
                    ))}
                </Accordion>
            </motion.div> 
    );
}

export default Activities;