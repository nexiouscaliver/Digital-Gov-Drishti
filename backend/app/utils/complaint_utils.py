import re
import os
import json
import logging
import traceback
import google.generativeai as genai
from dotenv import load_dotenv
from bson import ObjectId

# Custom JSON encoder for MongoDB ObjectId
class MongoJSONEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, ObjectId):
            return str(obj)
        return super().default(obj)

# Function to handle MongoDB ObjectId serialization
def sanitize_for_json(data):
    """Convert MongoDB document to JSON serializable format."""
    if isinstance(data, dict):
        for key, value in list(data.items()):
            if isinstance(value, ObjectId):
                data[key] = str(value)
            elif isinstance(value, dict):
                data[key] = sanitize_for_json(value)
            elif isinstance(value, list):
                data[key] = [sanitize_for_json(item) for item in value]
    elif isinstance(data, list):
        data = [sanitize_for_json(item) for item in data]
    return data

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configure Gemini API
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Simple keyword-based classifier for departments (fallback when no AI is available)
DEPARTMENT_KEYWORDS = {
    "garbage": "Sanitation Department",
    "trash": "Sanitation Department",
    "waste": "Sanitation Department",
    "collection": "Sanitation Department",
    "road": "Public Works Department",
    "pothole": "Public Works Department",
    "street": "Public Works Department",
    "water": "Water Department",
    "pipe": "Water Department",
    "leak": "Water Department",
    "electricity": "Electricity Department",
    "power": "Electricity Department",
    "outage": "Electricity Department",
    "school": "Education Department",
    "education": "Education Department",
    "teacher": "Education Department",
    "police": "Police Department",
    "crime": "Police Department",
    "safety": "Police Department",
    "hospital": "Health Department",
    "health": "Health Department",
    "medical": "Health Department",
    "park": "Parks and Recreation",
    "garden": "Parks and Recreation",
    "playground": "Parks and Recreation"
}

# List of possible departments for Gemini to choose from
DEPARTMENTS = [
    "Sanitation Department",
    "Public Works Department",
    "Water Department",
    "Electricity Department",
    "Education Department",
    "Police Department",
    "Health Department",
    "Parks and Recreation",
    "Housing Department",
    "Transport Department",
    "Tax Department",
    "General Administration"
]

# Severity levels
SEVERITY_LEVELS = {
    "critical": 5,  # Immediate attention required, major public safety concerns
    "high": 4,      # Urgent, affects many citizens or important infrastructure
    "medium": 3,    # Standard priority, typical service disruption
    "low": 2,       # Minor issues, can be addressed in regular queue
    "minimal": 1    # Very minor issue, low impact
}

def classify_complaint(title, description):
    """
    Determines the appropriate department for a complaint.
    Uses Gemini API if available, falls back to keyword matching.
    
    Args:
        title (str): The complaint title
        description (str): The complaint description
        
    Returns:
        str: The assigned department
    """
    try:
        # Try to use Gemini API first
        if GEMINI_API_KEY:
            try:
                department = classify_with_ai(title, description)
                if department:
                    return department
            except Exception as e:
                logger.warning(f"NLP classification failed: {str(e)}")
        
        # Fallback to keyword-based classification
        text = f"{title} {description}".lower()
        
        # Count keyword matches for each department
        department_scores = {}
        for keyword, department in DEPARTMENT_KEYWORDS.items():
            count = len(re.findall(r'\b' + re.escape(keyword.lower()) + r'\b', text))
            if count > 0:
                department_scores[department] = department_scores.get(department, 0) + count
        
        # Return the department with the highest score
        if department_scores:
            return max(department_scores.items(), key=lambda x: x[1])[0]
            
        # Default department if no matches
        return "General Administration"
    
    except Exception as e:
        logger.error(f"Error in complaint classification: {str(e)}")
        return "General Administration"

def classify_with_ai(title, description):
    """
    AI-based classification using Gemini API.
    
    Args:
        title (str): The complaint title
        description (str): The complaint description
        
    Returns:
        str: The AI-assigned department or None if not available
    """
    try:
        # Initialize the Gemini model
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")
        
        # Craft a prompt with clear instructions and context
        prompt = f"""
        You are an AI assistant for a Citizen Grievance Redressal System. Your task is to analyze citizen complaints 
        and assign them to the most appropriate government department.

        Based on the following complaint, determine which department should handle it. 
        Choose from the following departments:
        {', '.join(DEPARTMENTS)}

        Complaint Title: {title}
        Complaint Description: {description}

        Analyze the nature of the complaint, the issue described, and any specific services mentioned.
        Output only the department name, exactly as it appears in the list above. Do not include any additional text.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        department = response.text.strip()
        
        # Validate the response against our list of departments
        if department in DEPARTMENTS:
            logger.info(f"The AI classified the complaint to: {department}")
            return department
        else:
            logger.warning(f"The AI returned invalid department: {department}")
            return None
    
    except Exception as e:
        logger.error(f"Error in AI classification: {str(e)}")
        return None

def determine_severity(title, description):
    """
    Uses Gemini API to determine the severity level of a complaint.
    
    Args:
        title (str): The complaint title
        description (str): The complaint description
        
    Returns:
        dict: Contains severity level (string) and score (int)
    """
    try:
        if not GEMINI_API_KEY:
            # Default to medium severity if no API key
            logger.warning("No GEMINI_API_KEY found. Using default medium severity.")
            return {"level": "medium", "score": 3}
            
        # Initialize the Gemini model
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")
        
        # Keywords for severity detection
        urgency_keywords = {
            "critical": ["emergency", "urgent", "dangerous", "unsafe", "died", "death", "immediately", "hazardous", "critical"],
            "high": ["serious", "important", "severe", "significant", "harmful", "spreading", "multiple", "accidents"],
            "medium": ["needs attention", "issue", "problem", "malfunctioning", "broken", "not working"],
            "low": ["minor", "small", "slight", "inconvenience", "occasional", "sometimes"],
            "minimal": ["trivial", "tiny", "cosmetic", "barely", "minor aesthetic"]
        }
        
        # Craft a prompt with clear instructions and context
        prompt = f"""
        You are an AI assistant for a Citizen Grievance Redressal System. Your task is to analyze citizen complaints 
        and determine their severity level.

        Based on the following complaint, determine the severity level. 
        Choose from: critical, high, medium, low, minimal

        Consider factors like:
        - Public safety impact
        - Number of people affected
        - Duration of the issue
        - Potential for harm or damage
        - Urgency of required action

        Complaint Title: {title}
        Complaint Description: {description}

        Output only the severity level, exactly as one of the options listed. Do not include any additional text.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        severity_level = response.text.strip().lower()
        
        # Validate and map to our severity levels
        if severity_level in SEVERITY_LEVELS:
            score = SEVERITY_LEVELS[severity_level]
            logger.info(f"AI determined severity: {severity_level} (score: {score})")
            return {"level": severity_level, "score": score}
        else:
            # Fallback to keyword-based assessment
            logger.warning(f"AI returned invalid severity level: {severity_level}. Using keyword-based severity.")
            text = f"{title} {description}".lower()
            
            # Count keyword matches for each severity level
            severity_scores = {}
            for level, keywords in urgency_keywords.items():
                count = sum(1 for keyword in keywords if keyword.lower() in text)
                severity_scores[level] = count
            
            # Get the severity level with the highest score
            max_score = 0
            selected_level = "medium"  # Default
            for level, count in severity_scores.items():
                if count > max_score:
                    max_score = count
                    selected_level = level
            
            score = SEVERITY_LEVELS[selected_level]
            logger.info(f"Keyword-based severity: {selected_level} (score: {score})")
            return {"level": selected_level, "score": score}
    
    except Exception as e:
        logger.error(f"Error in severity determination: {str(e)}")
        # Default to medium severity on error
        return {"level": "medium", "score": 3}

def generate_complaint_blog(complaint_data):
    """
    Generates a blog post from a complaint using the Gemini API.
    
    Args:
        complaint_data (dict): The complaint data
        
    Returns:
        dict: Blog data with title, content, and metadata
    """
    try:
        complaint_id = complaint_data.get('complaint_id', 'Unknown')
        title = complaint_data.get('title', 'Untitled Complaint')
        description = complaint_data.get('description', '')
        
        # Handle location which could be a string or a dictionary
        location = complaint_data.get('location', {})
        if isinstance(location, str):
            location_str = location
        else:
            location_str = location.get('address', 'Unknown location')
        department = complaint_data.get('assigned_department', 'Unknown department')
        severity = complaint_data.get('severity', {}).get('level', 'medium')
        has_proof = complaint_data.get('verified', False)
        status = complaint_data.get('status', 'pending')
        
        if not GEMINI_API_KEY:
            logger.warning("No GEMINI_API_KEY found. Using template-based blog generation.")
            # Generate a basic templated blog
            blog_content = f"""
            A complaint has been registered about "{title}" at {location_str}.
            
            The issue has been assigned to {department} and is currently {status}.
            This issue has been classified as {severity} severity.
            
            The citizen described the issue as follows:
            "{description}"
            
            The complaint {"includes documentary proof." if has_proof else "does not include documentary proof."}
            """
            
            return {
                "title": f"Citizen Report: {title}",
                "content": blog_content.strip(),
                "location": location_str,
                "department": department,
                "severity": severity,
                "has_proof": has_proof,
                "verified": has_proof,
                "status": status,
                "complaint_link": f"/complaints/{complaint_id}"
            }
        
        # Initialize the Gemini model
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")
        
        # Craft a prompt with clear instructions
        prompt = f"""
        You are a professional content writer for a Citizen Grievance Redressal portal. Your task is to create 
        a brief, informative blog post based on a citizen's complaint. 
        
        The blog should:
        1. Be factual and objective
        2. Highlight the main issue without sensationalizing
        3. Include key details from the complaint
        4. Be written in a clear, approachable style
        5. Be relatively brief (around 300-400 words)
        
        Complaint Details:
        - Title: {title}
        - Location: {location_str}
        - Department Assigned: {department}
        - Severity: {severity}
        - Status: {status}
        - Has Documentary Proof: {has_proof}
        
        Complaint Description:
        "{description}"
        
        Format your response as the complete blog post. Use appropriate paragraphs and structure.
        Include a suitable headline at the beginning.
        """
        
        # Generate response from Gemini
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        # Extract blog title (first line) and content (remaining lines)
        lines = content.split('\n')
        blog_title = lines[0].strip().replace('#', '').strip()
        blog_content = '\n'.join(lines[1:]).strip()
        
        # Use the original title if extraction fails
        if not blog_title:
            blog_title = f"Citizen Report: {title}"
        
        return {
            "title": blog_title,
            "content": blog_content,
            "location": location_str,
            "department": department,
            "severity": severity,
            "has_proof": has_proof,
            "verified": has_proof,
            "status": status,
            "complaint_link": f"/complaints/{complaint_id}"
        }
    
    except Exception as e:
        logger.error(f"Error generating complaint blog: {str(e)}")
        logger.error(traceback.format_exc())
        
        # Fallback to a simple blog
        return {
            "title": f"Citizen Report: {complaint_data.get('title', 'Untitled Complaint')}",
            "content": f"A complaint has been registered regarding {complaint_data.get('title', 'an issue')}. The complaint is currently under review.",
            "location": location_value_fallback(complaint_data.get('location')),
            "department": complaint_data.get('assigned_department', 'Unknown department'),
            "severity": severity_value_fallback(complaint_data.get('severity')),
            "has_proof": complaint_data.get('verified', False),
            "verified": complaint_data.get('verified', False),
            "status": complaint_data.get('status', 'pending'),
            "complaint_link": f"/complaints/{complaint_data.get('complaint_id', 'unknown')}"
        }

def location_value_fallback(location_value):
    """Helper function to safely extract location string from different types"""
    if location_value is None:
        return "Unknown location"
    if isinstance(location_value, str):
        return location_value
    if isinstance(location_value, dict):
        return location_value.get('address', 'Unknown location')
    return str(location_value)
    
def severity_value_fallback(severity_value):
    """Helper function to safely extract severity from different types"""
    if severity_value is None:
        return "medium"
    if isinstance(severity_value, str):
        return severity_value
    if isinstance(severity_value, dict):
        return severity_value.get('level', 'medium')
    return "medium"

def detect_abusive_content(comment_text):
    """
    Uses Gemini API to detect abusive language in discussion comments.
    
    Args:
        comment_text (str): The discussion comment text to analyze
        
    Returns:
        dict: Contains detection result (boolean) and confidence score (float)
    """
    try:
        if not GEMINI_API_KEY:
            logger.warning("No GEMINI_API_KEY found. Using keyword-based abuse detection.")
            # Fallback to simple keyword-based detection
            abusive_keywords = [
                "idiot", "stupid", "fool", "jerk", "moron", "pathetic", 
                "incompetent", "corrupt", "useless", "worthless", "dumb", 
                "retard", "ass", "bitch", "damn", "shit", "fuck", "bastard",
                "crap", "loser", "scum", "trash", "garbage", "waste"
            ]
            
            comment_lower = comment_text.lower()
            found_keywords = [word for word in abusive_keywords if word in comment_lower]
            
            if found_keywords:
                logger.info(f"Detected abusive keywords in comment: {found_keywords}")
                return {
                    "is_abusive": True,
                    "confidence": 0.9,
                    "detected_keywords": found_keywords
                }
            return {
                "is_abusive": False,
                "confidence": 0.1
            }
        
        # Initialize the Gemini model
        model = genai.GenerativeModel(model_name="gemini-2.0-flash")
        
        # Craft a prompt with clear instructions and context
        system_prompt = """
        You are an AI content moderator for a government complaint portal. Your task is to analyze discussion comments 
        and detect any abusive or inappropriate language. Abusive language includes insults, hate speech, threats, 
        profanity, or any content that violates community guidelines.

        Respond with only a JSON object containing these fields:
        1. "is_abusive": (boolean) True if the content is abusive, False otherwise
        2. "confidence": (float between 0 and 1) Your confidence in this assessment
        3. "explanation": (string) A very brief explanation of why the content is flagged or not
        
        Format your response in the below format as valid JSON. For example:
        {"is_abusive": , "confidence": 0.95, "explanation": "The comment is respectful and contains no abusive language."}
        """
        user_prompt = f"""
        Analyze the following comment for abusive content:
        "{comment_text}"
        """
        prompt = system_prompt + user_prompt
        # Generate response from Gemini
        response = model.generate_content(prompt)
        content = response.text.strip()
        
        try:
            # Parse the JSON response
            result = json.loads(content)
            
            # Validate required fields
            if "is_abusive" not in result or "confidence" not in result:
                logger.warning(f"Invalid AI response format for abuse detection: {content}")
                return {
                    "is_abusive": False,
                    "confidence": 0.0,
                    "explanation": "Error processing comment"
                }
            
            # Log the result
            if result["is_abusive"]:
                logger.warning(f"AI detected abusive content: {result}")
            
            return result
            
        except json.JSONDecodeError as e:
            logger.error(f"Failed to parse AI response as JSON: {content}")
            logger.error(str(e))
            
            # Try to extract meaningful information if possible
            if "true" in content.lower():
                return {
                    "is_abusive": True,
                    "confidence": 0.7,
                    "explanation": "Potential abusive content detected (parsing error)"
                }
            return {
                "is_abusive": False,
                "confidence": 0.5,
                "explanation": "Unable to parse AI response"
            }
    
    except Exception as e:
        logger.error(f"Error in abusive content detection: {str(e)}")
        logger.error(traceback.format_exc())
        # Default to non-abusive on error
        return {
            "is_abusive": False,
            "confidence": 0.0,
            "explanation": f"Error: {str(e)}"
        } 