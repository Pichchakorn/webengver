import React, { useState, useEffect } from "react";
import { getAuth, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { db, GeoPoint } from "../firebase";
import { Form, Button, Alert, Container, Card, Row, Col, Accordion } from "react-bootstrap";
import { collection, addDoc, doc, getDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { httpsCallable } from "firebase/functions";
import { functions } from "../firebase";

function AddActivity() {
  const lang = localStorage.getItem("lang") || "en";
  const translateIfNeeded = httpsCallable(functions, "translateIfNeeded");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [error, setError] = useState("");
  const [activity, setActivity] = useState({
    id: "",
    name: "",
    description: "",
    date: "",
    locationName: "", // Added locationName
    latitude: "",
    longitude: "",
    imgURL: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [activitiesList, setActivitiesList] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      setIsAdmin(true);
      fetchActivities();
    }
  }, []);

  const fetchActivities = async () => {
    onSnapshot(collection(db, "activities"), (snapshot) => {
      const activitiesData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
      setActivitiesList(activitiesData);
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userRef = doc(db, "users", user.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && userSnap.data().role === "admin") {
        setIsAdmin(true);
        localStorage.setItem("userToken", user.uid);
        fetchActivities();
      } else {
        setError("You do not have access to this page.");
      }
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      setIsAdmin(false);
      localStorage.removeItem("userToken");
      setSuccessMessage("");
      setError("");
    }).catch((error) => {
      console.error("Error signing out: ", error);
      setError("An error occurred while signing out.");
    });
  };

  const handleChange = (e) => {
    setActivity({ ...activity, [e.target.name]: e.target.value });
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setSuccessMessage("");
  setError("");

  try {
    const { id, ...restOfActivity } = activity;
    const activityData = {
      ...restOfActivity,
      latitude: parseFloat(activity.latitude),
      longitude: parseFloat(activity.longitude),
      location: new GeoPoint(parseFloat(activity.latitude), parseFloat(activity.longitude)),
      locationName: activity.locationName,
    };

    let docRef;

    if (isEditing) {
      docRef = doc(db, "activities", id);
      await updateDoc(docRef, activityData);
    } else {
      docRef = await addDoc(collection(db, "activities"), activityData);
    }

    // ✅ เรียกแปลหลังบันทึก
    await translateIfNeeded({ docId: docRef.id });

    setSuccessMessage(isEditing ? "✅ Activity updated and translated!" : "✅ Activity added and translated!");
    setActivity({ id: "", name: "", description: "", date: "", locationName: "", latitude: "", longitude: "", imgURL: "" });
    setIsEditing(false);
  } catch (error) {
    console.error("Error adding/updating document: ", error);
    setError("⚠️ Error saving or translating activity.");
  }

  setTimeout(() => {
    setSuccessMessage("");
    setError("");
  }, 3000);
};


  const handleEdit = (activityData) => {
    let formattedDate = "";
    if (activityData.date) {
     if (typeof activityData.date.toDate === 'function') {
     formattedDate = activityData.date.toDate().toISOString().split('T')[0];
     } else if (typeof activityData.date === 'string') {
     formattedDate = activityData.date.split('T')[0]; // พยายามแยกส่วนที่เป็นวันที่ ถ้าเป็น String
    } else {
     // ถ้าไม่ใช่ Timestamp และไม่ใช่ String อาจจะตั้งค่าเป็นค่าว่าง หรือจัดการตามรูปแบบอื่นที่อาจมี
     formattedDate = "";
     }
     }
    
     let latitude = "";
     let longitude = "";
     if (activityData.location instanceof GeoPoint) {
     latitude = activityData.location.latitude;
     longitude = activityData.location.longitude;
   }
    
    setActivity({
    ...activityData,
    locationName: activityData.locationName || "",
    latitude: latitude,
    longitude: longitude,
    date: formattedDate,
    });
    setIsEditing(true);
    setSuccessMessage("");
    setError("");
    };

  const handleCancelEdit = () => {
    setActivity({ id: "", name: "", description: "", date: "", locationName: "", latitude: "", longitude: "", imgURL: "" }); // Reset locationName
    setIsEditing(false);
    setSuccessMessage("");
    setError("");
  };

  return (

    <Container fluid className="py-5" style={{ minHeight: "100vh" }}>
      <Row className="justify-content-center">
        <Col md={6} className="mb-4">
          <Card style={{ padding: "30px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)", borderRadius: "12px" }}>
            {!isAdmin ? (
              <div>
                <h2 className="text-center mb-4" style={{ color: "#343a40" }}>
                  {lang === "th" ? "เข้าสู่ระบบ" : "Log in"}
                </h2>
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label style={{ fontWeight: "bold" }}>Email</Form.Label>
                    <Form.Control type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">
                    <Form.Label style={{ fontWeight: "bold" }}>Password</Form.Label>
                    <Form.Control type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </Form.Group>

                  <Button variant="primary" type="submit" className="w-100" style={{ backgroundColor: "#007bff", borderColor: "#007bff", fontWeight: "bold"}}>
                    {lang === "th" ? "เข้าสู่ระบบ" : "Log in"}
                  </Button>
                </Form>
              </div>
            ) : (
              <div>
                <h2 className="text-center mb-4" style={{ color: "#28a745" }}>
                  {isEditing
                    ? (lang === "th" ? "แก้ไขกิจกรรม" : "Edit Activity")
                    : (lang === "th" ? "เพิ่มกิจกรรม" : "Add Activity")}
                </h2>
                {successMessage && <Alert variant="success" className="mb-3">{successMessage}</Alert>}
                {error && <Alert variant="danger" className="mb-3">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicName">
                    <Form.Label style={{ fontWeight: "bold" }}>{lang === "th" ? "ชื่อกิจกรรม" : "Activity Name"}</Form.Label>
                    <Form.Control type="text" name="name" placeholder={lang === "th" ? "ชื่อกิจกรรม" : "Activity Name"} value={activity.name} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicDescription">
                    <Form.Label style={{ fontWeight: "bold" }}>{lang === "th" ? "รายละเอียดกิจกรรม" : "Description"}</Form.Label>
                    <Form.Control as="textarea" name="description" rows={3} placeholder={lang === "th" ? "รายละเอียดกิจกรรม" : "Description"} value={activity.description} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicDate">
                    <Form.Label style={{ fontWeight: "bold" }}>{lang === "th" ? "วันที่จัดกิจกรรม" : "Date"}</Form.Label>
                    <Form.Control type="date" name="date" value={activity.date} onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicLocation">
                    <Form.Label style={{ fontWeight: "bold" }}>{lang === "th" ? "สถานที่" : "Location"}</Form.Label>
                    <Form.Control type="text" name="locationName" placeholder={lang === "th" ? "สถานที่" : "Location"} value={activity.locationName} onChange={handleChange} required />
                  </Form.Group>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group controlId="formBasicLatitude">
                        <Form.Label style={{ fontWeight: "bold" }}>{lang === "th" ? "ละติจูด" : "Latitude"}</Form.Label>
                        <Form.Control type="text" name="latitude" placeholder="ex. 13.7563" value={activity.latitude} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group controlId="formBasicLongitude">
                        <Form.Label style={{ fontWeight: "bold" }}>{lang === "th" ? "ลองจิจูด" : "Longitude"}</Form.Label>
                        <Form.Control type="text" name="longitude" placeholder="ex. 100.5018" value={activity.longitude} onChange={handleChange} required />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3" controlId="formBasicImgUage URL">
                    <Form.Label style={{ fontWeight: "bold" }}>{lang === "th" ? "ลิงก์รูปภาพ" : "Image URL"}</Form.Label>
                    <Form.Control type="text" name="imgURL" placeholder={lang === "th" ? "ลิงก์รูปภาพ" : "Image URL"} value={activity.imgURL} onChange={handleChange} />
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    {isEditing && (
                      <Button variant="secondary" onClick={handleCancelEdit} className="me-2" style={{ fontWeight: "bold" }}>
                        {lang === "th" ? "ยกเลิก" : "Cancel"}
                      </Button>
                    )}
                    <Button variant={isEditing ? "warning" : "success"} type="submit" style={{ fontWeight: "bold" }}>
                      {lang === "th" ? "บันทึกกิจกรรม" : isEditing ? "Save Changes" : "Save Activity"}
                    </Button>
                  </div>
                </Form>
              </div>
            )}
          </Card>
        </Col>

        {isAdmin && (
          <Col md={6}>
            <Card style={{ padding: "30px", boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.08)", borderRadius: "12px" }}>
              <h2 className="mb-3" style={{ color: "#007bff" }}>{lang === "th" ? "รายการกิจกรรม" : "Activity List"}</h2>
              {activitiesList.length > 0 ? (
                <Accordion defaultActiveKey="0">
                  {Object.entries(
                    activitiesList.reduce((groups, act) => {
                      const groupName = act.name;
                      if (!groups[groupName]) {
                        groups[groupName] = [];
                      }
                      groups[groupName].push(act);
                      return groups;
                    }, {})
                  ).map(([groupName, groupItems], index) => (
                    <Accordion.Item eventKey={index.toString()} key={groupName}>
                      <Accordion.Header>{groupName}</Accordion.Header>
                      <Accordion.Body>
                        <ul className="list-group">
                          {groupItems.map((act) => (
                            <li key={act.id} className="list-group-item d-flex justify-content-between align-items-start flex-wrap">
                              <div>
                                <strong style={{ color: "#343a40" }}>{act.description}</strong>
                                <br />
                                <small className="text-muted">
                                  {act.date?.toDate
                                    ? act.date.toDate().toLocaleDateString("th-TH", {
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      })
                                    : act.date}
                                </small>
                                <br />
                                <span className="text-muted">{act.locationName}</span> {/* Display locationName */}
                                {act.location instanceof GeoPoint && (
                                  <span className="text-muted">
                                    (Lat: {act.location.latitude.toFixed(6)}, Long: {act.location.longitude.toFixed(6)})
                                  </span>
                                )}
                              </div>
                              <div className="mt-2 mt-sm-0">
                                <Button
                                  variant="info"
                                  size="sm"
                                  onClick={() => handleEdit(act)}
                                  style={{ fontWeight: "bold" }}
                                >
                                  {lang === "th" ? "แก้ไข" : "Edit"}
                                </Button>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
              ) : (
                <p className="text-muted">No activities found.</p>
              )}
            </Card>
          </Col>
        )}
      </Row>

      {isAdmin && (
        <div className="fixed-bottom p-3 d-flex justify-content-end">
          <Button
            variant="danger"
            onClick={handleLogout}
            style={{
              padding: "12px 20px",
              fontSize: "16px",
              borderRadius: "8px",
              fontWeight: "bold",
              boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
            }}
          >
            	{lang === "th" ? "ออกจากระบบ" : "Log out"}
          </Button>
        </div>
      )}
    </Container>
  
  );
}

export default AddActivity;