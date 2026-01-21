import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { fetchAllFAQ } from '../../../api/faq/api-faq'
import CircleLoader from '../../../components/loaders/CircleLoader'

interface FAQQuestionProps {
  isOpen: boolean;
}

interface FAQAnswerProps {
  isOpen: boolean;
}

// Styled Components
const FAQContainer = styled.div`
  max-width: 800px;
  // margin: 0 auto;
  // padding: 40px 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
`;

const FAQHeader = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 30px;
  // text-align: center;
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const FAQItem = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.12);
    transform: translateY(-2px);
  }
`;

const FAQQuestion = styled.div<FAQQuestionProps>`
  padding: 18px 24px;
  font-weight: 600;
  font-size: 18px;
  color: #2c3e50;
  background-color: #f8f9fa;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  &::after {
    content: "${props => props.isOpen ? '−' : '+'}";
    font-size: 22px;
    color: #6c757d;
  }
`;

const FAQAnswer = styled.div<FAQAnswerProps>`
  padding: ${props => (props.isOpen ? "16px 24px" : "0 24px")};
  max-height: ${props => (props.isOpen ? "500px" : "0")};
  overflow: hidden;
  line-height: 1.6;
  font-size: 16px;
  color: #495057;
  transition: all 0.3s ease;
`;

const NoResultsMessage = styled.p`
  text-align: center;
  margin-top: 40px;
  color: #6c757d;
  font-size: 18px;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  color: #495057;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 20px;

  &:hover {
    background-color: #e9ecef;
    border-color: #ced4da;
    color: #212529;
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ArrowIcon = styled.span`
  font-size: 18px;
  font-weight: bold;
`;

const FAQPage: React.FC = () => {
  const navigate = useNavigate();
  const [faqs, setFaqs] = useState<any>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/dashboard');
    }
  };

  useEffect(() => {
    const loadFAQs = async () => {
      setLoading(true);
      try {
        const response = await fetchAllFAQ();
        if (response.faqs) {
          setFaqs(response.faqs);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Error loading FAQs:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadFAQs();
  }, []);
    

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) {
    return (
      <CircleLoader />
    );
  }

  if (error) {
    return (
      <FAQContainer>
        <FAQHeader>Frequently Asked Questions</FAQHeader>
        <p style={{ textAlign: 'center', color: '#dc3545' }}>
          Unable to load FAQs. Please try again later.
        </p>
      </FAQContainer>
    );
  }

  if (faqs.length === 0) {
    return (
      <FAQContainer>
        <FAQHeader>Frequently Asked Questions</FAQHeader>
        <NoResultsMessage>No FAQs available at the moment.</NoResultsMessage>
      </FAQContainer>
    );
  }

  return (
    <FAQContainer>
      <BackButton onClick={handleBack}>
        <ArrowIcon>←</ArrowIcon>
        <span>Back</span>
      </BackButton>
      <FAQHeader>Frequently Asked Questions</FAQHeader>
      <FAQList>
        {faqs.map((faq, index) => (
          <FAQItem key={faq._id}>
            <FAQQuestion
              isOpen={openIndex === index}
              onClick={() => toggleFAQ(index)}
            >
              {faq.question}
            </FAQQuestion>
            <FAQAnswer isOpen={openIndex === index}>
              <p dangerouslySetInnerHTML={{__html: faq.answer}}/>
            </FAQAnswer>
          </FAQItem>
        ))}
      </FAQList>
    </FAQContainer>
  );
};

export default FAQPage;