import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col } from 'react-bootstrap';
import { useLocation, useNavigate } from "react-router-dom";
import ActivityCard from "./ActivityCard";
import '../Activities.css';


function ActivityDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const activities = location.state?.activities || [];
    const [expandedIndex, setExpandedIndex] = useState(null);
    const lang = localStorage.getItem("lang") || "en";

    return (
        <div className="container">
            <h2>{activities.length > 0 ? activities[0].name : "กิจกรรม"}</h2>

            <button className="d-flex justify-content-start mb-3"           
                style={{ 
                    backgroundColor: "#D6E6FF", 
                    color: "#004085",
                    borderRadius: "5px"
                    }} 
                onClick={() => navigate(-1)}>back</button>
            <Row className="g-4">
                {activities.map((activity, index) => (
                    <Col key={index} md={4}>
                    <ActivityCard 
                        name={lang === "th" ? activity.name_th || activity.name : activity.name} 
                        description={lang === "th" ? activity.description_th || activity.description : activity.description} 
                        image={activity.image}
                        expanded={expandedIndex === index}
                        onToggle={() => setExpandedIndex(expandedIndex === index ? null : index)}
                    />

                    </Col>
                ))}
            </Row>
        </div>
    );
}

export default ActivityDetails;