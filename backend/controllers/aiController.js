const Complaint = require('../models/Complaint');
const axios = require('axios');

// @desc    AI Complaint Analyzer
// @route   POST /api/ai/analyze
// @access  Public
exports.analyzeComplaint = async (req, res, next) => {
  try {
    const { id } = req.body;

    let complaint = await Complaint.findById(id);

    if (!complaint) {
      return res.status(404).json({ success: false, message: 'Complaint not found' });
    }

    if (!process.env.OPENROUTER_API) {
      return res.status(500).json({ success: false, message: 'OpenRouter API key is not configured' });
    }

    const prompt = `
Analyze the following complaint:
Title: ${complaint.title}
Description: ${complaint.description}
Category: ${complaint.category}
User Name: ${complaint.name}

Provide a JSON response with the following keys exactly:
"priority": (High, Medium, or Low),
"department": (Name of the recommended department),
"summary": (A short 1-2 sentence summary of the issue),
"autoResponse": (A polite auto-generated response addressed to the User Name acknowledging the issue)

Return ONLY valid JSON. No markdown formatting, no backticks, no explanations.
`;

    const aiResponse = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }]
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:5000', // Optional but recommended by OpenRouter
          'X-Title': 'Smart Complaint System'
        }
      }
    );

    let content = aiResponse.data.choices[0].message.content.trim();
    
    // Remove potential markdown block formatting if model still adds it
    if (content.startsWith('```json')) {
      content = content.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (content.startsWith('```')) {
      content = content.replace(/^```/, '').replace(/```$/, '').trim();
    }

    const aiData = JSON.parse(content);

    complaint.aiPriority = aiData.priority || 'Medium';
    complaint.aiDepartment = aiData.department || 'General Services';
    complaint.aiSummary = aiData.summary || 'Summary unavailable.';
    complaint.aiResponse = aiData.autoResponse || 'Thank you for your complaint. We will look into it.';

    await complaint.save();

    res.status(200).json({
      success: true,
      data: {
        priority: complaint.aiPriority,
        department: complaint.aiDepartment,
        summary: complaint.aiSummary,
        autoResponse: complaint.aiResponse
      }
    });

  } catch (err) {
    console.error('AI Analysis Error:', err.response?.data || err.message);
    // Fallback if AI fails so the request doesn't completely fail for the user
    try {
      const { id } = req.body;
      let complaint = await Complaint.findById(id);
      if (complaint && !complaint.aiPriority) {
        complaint.aiPriority = 'Medium';
        complaint.aiDepartment = 'General Support';
        complaint.aiSummary = 'AI Analysis temporarily unavailable. Complaint registered successfully.';
        complaint.aiResponse = `Dear ${complaint.name}, your complaint has been received.`;
        await complaint.save();
        
        return res.status(200).json({
          success: true,
          message: 'AI Analysis temporarily unavailable. Used fallback data.',
          data: {
            priority: complaint.aiPriority,
            department: complaint.aiDepartment,
            summary: complaint.aiSummary,
            autoResponse: complaint.aiResponse
          }
        });
      }
    } catch (e) {
      console.error("Fallback error:", e);
    }

    res.status(500).json({ success: false, message: err.response?.data?.error?.message || err.message || 'Error analyzing complaint with AI' });
  }
};
