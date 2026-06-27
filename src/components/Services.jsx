import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const services = [
  { title: "سحب الطوارئ", desc: "استجابة سريعة 24/7", img: "/images/service1.jpg" },
  { title: "نقل داخل المدينة", desc: "آمن وسريع", img: "/images/service2.jpg" },
  { title: "نقل لمركز الصيانة", desc: "نوصلك لمكان التصليح", img: "/images/service3.jpg" },
];

export default function Services(){
  return (
    <div className="my-5">
      <h2 className="mb-4 text-center">خدماتنا</h2>
      <Row className="g-3">
        {services.map((s, i) => (
          <Col md={4} key={i}>
            <Card className="service-card card custom p-2 h-100">
              <Card.Img src={s.img} alt={s.title} style={{height:160, objectFit:'cover'}}/>
              <Card.Body className="text-center">
                <Card.Title>{s.title}</Card.Title>
                <Card.Text className="text-muted">{s.desc}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}
