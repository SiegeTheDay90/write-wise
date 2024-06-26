# frozen_string_literal: true

class GenerateBioJob < ApplicationJob
  queue_as :default

  def perform(request, user, payload)
    bio = text_to_user_bio(payload)

    if !bio
      request.complete!(false, nil, ['Error while generating bio.'])
    else
      request.complete!(true, user.id, bio)
    end
  end

  def text_to_user_bio(text)
    OpenAI.configure do |config|
      config.access_token = ENV['OPENAI']
    end
    client = OpenAI::Client.new

    response = client.chat(
      parameters: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system',
            content: 'Return JSON with values that summarize this document. Use exactly these keys: {"aboutme": "string", "skills": str[], "education": str[], "projects": str[], "experience": str[]}. Your response must be only valid JSON with a flat shape. "aboutme" should be at least 2 sentences long. If "skills" would be empty, use generic professional skills such as Time Management, Communication, Teamwork, Problem Solving' },
          { role: 'user', content: text }
        ],
        response_format: { type: 'json_object' },
        temperature: 1.4,
        max_tokens: 4096
      }
    )
    begin
      response['choices'][0]['message']['content']
    rescue StandardError
      false
    end
  end
end
