import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { db } from "../firebase"; // Firebase import
import { collection, getDocs } from "firebase/firestore";
import { motion } from "framer-motion"; // นำเข้า Framer Motion สำหรับการเคลื่อนไหว
import { Row, Col, Card } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css'; // ต้องนำเข้าไฟล์ CSS ของ leaflet
import L from 'leaflet'; // เพิ่มการนำเข้า L สำหรับการกำหนด Icon
import background_en from "../pics/background_en.png"; 
import background_th from "../pics/background_th.jpg"; 
import markerIcon from "../pics/markerIcon.png"
import './ActivityMap.css'
import centerImage1 from '../pics/แบ่งต่อ1.jpg'; 
import centerImage2 from '../pics/แบ่งต่อ2.jpg'; 
import centerImage3 from '../pics/แบ่งต่อ3.jpg'; 
import centerImage4 from '../pics/แบ่งต่อ4.jpg'; 
import centerImage5 from '../pics/แบ่งต่อ14.jpg'; 
import centerImage6 from '../pics/แบ่งต่อ6.jpg'; 
import centerImage7 from '../pics/แบ่งต่อ14.jpg'; 
import centerImage8 from '../pics/แบ่งต่อ14.jpg'; 
import centerImage9 from '../pics/แบ่งต่อ9.jpg'; 
import centerImage10 from '../pics/แบ่งต่อ10.jpg'; 
import centerImage11 from '../pics/แบ่งต่อ11.jpg'; 
import centerImage12 from '../pics/แบ่งต่อ12.jpg'; 
import centerImage13 from '../pics/แบ่งต่อ13.jpg'; 

const defaultCenter = { lat: 13.736717, lng: 100.523186 }; // กรุงเทพฯ


function ActivityMap() {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const lang = localStorage.getItem("lang") || "en";
  const background = lang === "th" ? background_th : background_en;


  useEffect(() => {
    const fetchActivities = async () => {
      const querySnapshot = await getDocs(collection(db, "activities"));
      const activitiesData = querySnapshot.docs.map((doc) => doc.data());
      console.log(activitiesData); // ตรวจสอบข้อมูลที่ดึงมา
      setActivities(activitiesData);
    };
  
    fetchActivities();
  }, []);

  const parseDate = (date) => {
    if (date && date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    const parsedDate = new Date(date);
    return isNaN(parsedDate) ? "ไม่ทราบวันที่" : parsedDate.toLocaleDateString();
  };

  const customIcon = new L.Icon({
    iconUrl: markerIcon, 
    iconSize: [15, 20],
    iconAnchor: [16, 32], 
    popupAnchor: [0, -32] 
  });


return ( 
<div style={{background:"#fff9db"}}>  
  <div className="text-center" style={{width:"100vw", padding: 0, margin: 0}}>
    <div className="justify-content-center">
      <motion.img 
        src={background} 
        alt="background" 
        className="full-screen-image"
        style={{ width: "100%", height: "100%", objectFit: "cover", marginTop: "-100px" }}
        initial={{ opacity: 0, scale: 1.1 }} 
        animate={{ opacity: 1, scale: 1 }} 
        transition={{ duration: 1.5, ease: "easeOut" }} 
      />

    </div>

    <h1 className="text-center my-5">
      {lang === "th" ? "กิจกรรมทั้งหมดที่แสดงบนแผนที่ 🗺️" : "All Activities Marked on the Map 🗺️"}
    </h1>

    <div className="d-flex justify-content-center my-5">
    <MapContainer center={defaultCenter} zoom={10} style={{ width: "90%", height: "500px" }}>
  <TileLayer
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />
  {activities.map((act, index) => {
    // ดึง lat lng จาก GeoPoint โดยตรง
    const latitude = act.location?.latitude;
    const longitude = act.location?.longitude;

    console.log('Latitude:', latitude, 'Longitude:', longitude);

    if (latitude == null || longitude == null) {
      console.warn(`Location ไม่ครบสำหรับกิจกรรม: ${act.name}`, act.location);
      return null;
    }

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: index * 0.1, duration: 1 }}
      >
        <Marker
          position={{ lat: latitude, lng: longitude }}
          icon={customIcon}
          eventHandlers={{
            click: () => setSelectedActivity(act),
          }}
        >
          {selectedActivity && selectedActivity.name === act.name && (
          <Popup>
            <div>
              <h3>
                {lang === "th"
                  ? act.name_th || act.name || "ไม่มีชื่อกิจกรรม"
                  : act.name || act.name_th || "No activity name"}
              </h3>
              <p>
                {lang === "th"
                  ? act.description_th || act.description || "ไม่มีคำอธิบาย"
                  : act.description || act.description_th || "No description"}
              </p>
              <p>
                <strong>Date:</strong> {parseDate(act.date)}
              </p>
              <p>
                <strong>Address:</strong>{" "}
                {lang === "th"
                  ? act.locationName_th || act.locationName || "ไม่มีที่อยู่"
                  : act.locationName || act.locationName_th || "No address"}
              </p>
              {act.imgURL && (
                <img
                  src={act.imgURL}
                  alt={act.name}
                  style={{
                    width: "150px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
              )}
            </div>
          </Popup>
          )}
        </Marker>
      </motion.div>
    );
  })}
</MapContainer>

      </div>
      
      
      <div className="container mt-4 info-section-background" >
        <h1 className="text-center mb-6" style={{ margin: "5%"}}>{lang === "th" ? "กิจกรรมของศูนย์แบ่งต่อ" : "Community Activities by Mirror Foundation's Sharing Center"}</h1>
          <Row>
            <Col md={4} className="mb-4 ">
              <motion.div 
                whileHover={{ scale: 1.05 }} 
                whileTap={{ scale: 0.95 }} 
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage1} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }}/>
                  <Card.Body>
                    <Card.Title>
                      {lang === "th" ? "กิจกรรมกวักน้องมาเรียน"  : "Activity: Bring Kids Back to School"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? "กิจกรรมที่มุ่งลดจำนวนเด็กที่เสี่ยงหลุดจากระบบการศึกษา และนำเด็กที่หลุดออกไปแล้วกลับเข้าสู่ระบบ เพื่อให้พวกเขามีโอกาสในอนาคตที่ดีขึ้น"
                        : "An activity aimed at reducing the number of children at risk of dropping out of the education system and bringing those who have already dropped out back into the system to ensure better opportunities for their future."
                      }
                    </Card.Text>
                  </Card.Body>

                </Card>
              </motion.div>
            </Col>
    
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage2} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                      {lang === "th" ? "กิจกรรมพ้นวิกฤต" : "Activity: Crisis Recovery"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? "กิจกรรมที่นำวัสดุต่างๆไปช่วยซ่อมแซมปรับปรุงที่อยู่อาศัยที่อยู่ในภาวะวิกฤติ ที่อาจมีผลต่อคุณภาพชีวิต ไปจนถึงเสี่ยงอันตรายต่อชีวิต โดยวัสดุที่นำไปทำมีทั้งวัสดุเหลือใช้ วัสดุที่ได้รับบริจาคมาต่างๆ"
                        : "This activity involves providing materials to help repair and improve housing in crisis conditions, which could impact quality of life and even pose life-threatening risks. The materials used are repurposed or donated."
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
    
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage3} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                      {lang === "th" ? "กิจกรรมแบ่งต่อเรนเจอร์" : "Activity: Sharing Ranger"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? "กิจกรรมที่จะไปสร้างแรงบันดาลใจให้เด็กๆตามโรงเรียน ซ่อมแซมพื้นที่ในโรงเรียนให้พร้อมใช้งาน และกิจกรรมที่ไปสร้างกำลังใจให้ผู้คนต่างๆ เช่น กิจกรรมรดน้ำดำหัวดิลิเวอร์รี่, กิจกรรมซานต้า is you"
                        : 'This activity inspires children in schools, repairs school facilities to make them usable, and motivates people through activities like "Watering and Blessing Delivery" and "Santa is You"'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage4} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                      {lang === "th" ? "กิจกรรมกล่องช่วยหมอ" : "Activity: Doctors' Help Box"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? "กิจกรรมที่สร้างทีมอาสาสมัครช่วยกันผลิตของจากวัสดุต่างๆมาส่งให้ทีมแพทย์ เช่น ถุงสวมเท้าชุด ppe, ถักปลอกมือกันคนไข้ดึงสายน้ำเกลือ, ถุงใส่สายฟอกไต"
                        : 'A volunteer-based activity where people create items from various materials to be delivered to medical teams, such as foot covers, PPE suits, hand covers to prevent patients from pulling IV lines, and dialysis bags.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage5} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                    {lang === "th" ? "กิจกรรมต้นปันใจ" : "Activity: Heart Sharing Tree"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? "กิจกรรมที่ให้อาสาช่วยจัดหากระถางต้นไม้ และต้นไม้เล็กๆเพื่อเพ้นท์และส่งต่อให้กลุ่มผู้ป่วยในแผนกจิตเวช"
                        : 'An activity where volunteers provide small plants and pots for painting, then pass them on to psychiatric patients in hospitals.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage6} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                    {lang === "th" ? "กิจกรรมห้องดนตรีแบ่งต่อ" : "Activity: Sharing Music Room"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? "กิจกรรมที่รวบรวมเครื่องดนตรี อุปกรณ์ดนตรี ไปสร้างห้องเรียนดนตรีให้โรงเรียนที่มีครูดนตรีแต่ไม่มีอุปกรณ์ดนตรีในการใช้สอนเด็ก"
                        : 'This activity collects musical instruments and equipment to create music classrooms in schools that have music teachers but lack the necessary instruments to teach students.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage7} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                    {lang === "th" ? "กิจกรรม Recycle Run" : "Activity: Recycle Run"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? "กิจกรรมจัดวิ่งระดมทุนค่าจัดการ บริหารงานศูนย์แบ่งต่อ และค่าจัดส่งวัสดุอุปกรณ์ต่างๆให้นักเรียนยากจน โดยถ้วยรางวัลและเหรียญรางวัลจะใช้เป็นวัสดุรีไซเคิลทั้งมดเพื่อแสดงให้เห็นการนำของกลับมาใช้ใหม่"
                        : 'A fundraising event to support the operations of the Sharing Center and to deliver educational materials to underprivileged students. The trophies and medals are made from recycled materials to highlight the importance of reusing items.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage8} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                    {lang === "th" ? "กิจกรรม mirror chance talent" : "Activity: Mirror Chance Talent"}
                    </Card.Title>
                    <Card.Text>
                     {lang === "th"
                        ? "กิจกรรมจัดประกวดความสามารถเด็กพิการเพื่อสร้างกำลังใจและเปิดโอกาสให้เด็กๆได้มีโอกาสได้แสดงออก"
                        : 'A talent competition for disabled children to boost their confidence and provide opportunities for them to showcase their abilities.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage9} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                    {lang === "th" ? "กิจกรรมฝากยิ้มกลับบ้าน" : "Activity: Leave a Smile at Home"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? " กิจกรรมที่นำตุ๊กตาไปแจกให้พนักงานโรงงานเพื่อนำกลับไปฝากลูกหลานได้ มีข้อม้ต้องกลับไปยิ้มให้ครอบครัว 1 ครั้ง เป็นกิจกรรมที่ต้องการให้ตระหนักเรื่องอย่าลืมพูดคุยและยิ้มให้ครอบครัว เพื่อลดอัตราความรุนแรงในครอบครัวในอนาคต"
                        : 'This activity involves giving dolls to factory workers to take home for their children, encouraging them to smile and engage with their families. It aims to reduce family violence by fostering communication and positive interactions.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage10} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                      {lang === "th" ? "กิจกรรมตาต่อตา" : " Activity: Eye for an Eye"}
                    </Card.Title>
                    <Card.Text>
                      {lang === "th"
                        ? "กิจกรรมที่ไปแจกแว่นสายตาให้ผู้สูงอายุในชุมชน"
                        : ' An activity where eyeglasses are distributed to elderly people in the community to improve their quality of life.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage11} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                     {lang === "th" ? "กิจกรรมธนาคารโอกาส" : "Activity: Opportunity Bank"}
                    </Card.Title>
                    <Card.Text>
                       {lang === "th"
                        ? "ธนาคารโอกาสร่วมกับกองทุนเพื่อความเสมอภาคทางการศึกษา ส่งโอกาสการศึกษาไปยังเด็กยากจน เช่น ส่งอุปกรณ์การเรียน และประสานงานกับโรงเรียน"
                        : 'An initiative in collaboration with the Education Fund to provide educational opportunities for children, including sending necessary materials and coordinating with schools to help students access education.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage12} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                     {lang === "th" ? "กิจกรรมถนนครูเดิน" : "Activity: Teacher’s Walk Street"}
                    </Card.Title>
                    <Card.Text>
                     {lang === "th"
                        ? "กิจกรรมที่ผลักดันขับเคลื่อนเชิงนโยบายด้านการศึกษาเรื่องการจัดสรรงบประมาณที่ขาดแคลนใน ร.ร.ขนาดเล็ก ร.ร.พื้นที่สูง และห่างไกล"
                        : 'This activity pushes for educational policy reform, particularly in terms of budget allocation for small schools, remote schools, and schools in mountainous areas that face resource shortages.'
                      }
                    </Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
            <Col md={4} className="mb-4">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
                  <Card.Img variant="top" src={centerImage13} style={{ borderTopLeftRadius: '20px', borderTopRightRadius: '20px' }} />
                  <Card.Body>
                    <Card.Title>
                      {lang === "th" ? "ส่งของบริจาคให้หน่วยงานและเคสขอความช่วยเหลือทั่วประเทศ" : "Donation Delivery to Agencies and Help Cases Nationwide"}
                    </Card.Title>
                    <Card.Text>                     
                      {lang === "th"
                        ? "กิจกรรมส่งของบริจาคไปยังหน่วยงานและผู้ประสบปัญหาทั่วประเทศ"
                        : 'An activity where donations are distributed to organizations and individuals in need across the country.'
                      }</Card.Text>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
    
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 1 }}
          >
          </motion.div>
      </div>
    </div> 
    </div>
  );
}

export default ActivityMap;