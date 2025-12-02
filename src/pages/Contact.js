import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";
import { FaFacebook, FaYoutube } from "react-icons/fa";
import "./Contact.css"; 
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet"; // Import leaflet for custom icons
import markerIcon from "../pics/markerIcon.png"; // Import image

const defaultCenter = { lat: 13.86893, lng: 100.57914 };  

// Use the imported image directly for the marker icon
const icon = new L.Icon({
  iconUrl: markerIcon, // Use the imported image here
  iconSize: [18, 25],
  iconAnchor: [16, 32], 
  popupAnchor: [0, -32] 
});

function Contact() {
  const [hover, setHover] = useState(false);
  const lang = localStorage.getItem("lang") || "en";

  useEffect(() => {
    document.body.style.backgroundColor = "#fff9db";
    return () => {
      document.body.style.backgroundColor = "";
    };
  }, []);

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          {/* Animation for showing the address card */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <Card className="p-3 shadow-sm contact-card">
              <Card.Body>
                <Card.Title>{lang === "th" ? "📍 ที่อยู่" : "📍 Address"}</Card.Title>
                  <Card.Text>
                    {lang === "th"
                      ? "191 ซอยวิภาวดี 62 แยก 4-7 ถนนวิภาวดีรังสิต\n แขวงตลาดบางเขน เขตหลักสี่ กรุงเทพฯ 10210"
                      : "191 Vibhavadi 62 Alley (Intersection 4-7), Vibhavadi Rangsit Road\n Talat Bang Khen, Lak Si, Bangkok 10210"}
                  </Card.Text>
                <Card.Title>🕒{lang === "th" ? "เวลาทำการ" : "Working Hour"}</Card.Title>
                <Card.Text>
                  {lang === "th" ? (
                    <>
                      จันทร์ถึงศุกร์: <span className="highlight">09:30 น. - 17:00 น.</span><br />
                      เสาร์, อาทิตย์ และวันหยุดนักขัตฤกษ์: <span className="highlight">10:00 น. - 16:00 น.</span>
                    </>
                  ) : (
                    <>
                      Monday to Friday: <span className="highlight">09:30 AM - 05:00 PM</span><br />
                      Saturday, Sunday, and Public Holidays: <span className="highlight">10:00 AM - 04:00 PM</span>
                    </>
                  )}
                </Card.Text>

                <Card.Title>{lang === "th" ? "☎️ ติดต่อผู้บริจาค" : "☎️ Donor Relations"}</Card.Title>
                <Card.Text>
                  <span className="phone">{lang === "th" ? "สายด่วน: 061-909-1840" : "Hotline: 061-909-1840"}</span><br />
                  Email: <a href="mailto:donate@mirror.or.th" className="email-link">donate@mirror.or.th</a>
                </Card.Text>
                </Card.Body>
                </Card>
                </motion.div>
                </Col>

                <Col md={6}>
                  <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1 }}>
                    <div style={{ width: "100%", height: "350px", borderRadius: "10px", overflow: "hidden" }}>
                      <MapContainer center={defaultCenter} zoom={14} style={{ width: "100%", height: "100%" }}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Marker position={defaultCenter} icon={icon}>
                          <Popup>{lang === "th" ? "ตำแหน่งของเรา" : "Our Location"}</Popup>
                        </Marker>
                      </MapContainer>
                    </div>
                  </motion.div>
                </Col>
                </Row>

                <Row className="mt-4">
                  <Col>
                    <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 80, damping: 15 }}>
                      <Card className="p-3 shadow-sm social-card" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
                        <Card.Body>
                          <Card.Title>{lang === "th" ? "📢 โซเชียลมีเดีย" : "📢 Social Media"}</Card.Title>
                          <Card.Text>
                            <FaFacebook className="social-icon" /> Facebook:{" "}
                            <a href="https://www.facebook.com/sharingmirrorfoundation/?locale=th_TH" target="_blank" rel="noopener noreferrer">
                              {lang === "th" ? "ศูนย์แบ่งต่อ มูลนิธิกระจกเงา" : "Mirror Foundation's Sharing Center "}
                            </a>
                            <br />
                            <FaYoutube className="social-icon youtube" /> YouTube:{" "}
                            <a href="https://www.youtube.com/channel/UCXsR1uSNB_0nNpWAWSbtvPQ" target="_blank" rel="noopener noreferrer">
                              {lang === "th" ? "ศูนย์แบ่งต่อ มูลนิธิกระจกเงา" : "Mirror Foundation's Sharing Center "}
                            </a>
                          </Card.Text>
                        </Card.Body>
                      </Card>
                    </motion.div>
                  </Col>
                </Row>
                </Container>
                );
                }

export default Contact;
