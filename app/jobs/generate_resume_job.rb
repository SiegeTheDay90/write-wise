# frozen_string_literal: true

class GenerateResumeJob < ApplicationJob
  queue_as :default

  def perform(request, text)
    resume = text_to_resume(text)

    if !resume
      request.complete!(false, nil, ['Error while generating resume.'])
    elsif resume.include?("-@-ErrorString-@-")
      request.complete!(false, nil, resume.gsub("-@-ErrorString-@-", ""))
    else
      request.complete!(true, nil, resume)
    end
  end

  def gptEval(bullet)
    OpenAI.configure do |config|
      config.access_token = ENV['OPENAI']
    end
    client = OpenAI::Client.new

    response = client.chat(
      parameters: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: "This is a bullet point for a resume. A bullet point should have 5 qualities.
          Evaluate the bullet point given by the user, returning an json object in format {A: boolean, B: boolean, C: boolean} where A B and C correspond to: (A) Be brief; it should be 150 characters or less.
          (B) Be specific; use an action verb.
          (C) Highlight metrics; Include a numeric measurement to show the impact of your skills."},
          { role: 'user', content: bullet }
        ],
        response_format: { type: 'json_object' },
        temperature: 1.3,
        max_tokens: 4096
      }
    )

    result = JSON.parse(response['choices'][0]['message']['content'])


    # Manually added ratings fields
    result["A"] = bullet.gsub(" ", "").length > 150

    # Additional fields
    result["meta"] = {}
    result["meta"]["total"] = result.values.inject(0){|acc, val| acc + (val ? 0 : 1)}
    result["meta"]["id"] = SecureRandom.alphanumeric
    result["meta"]["dismissed"] = false


    descriptions = { 
      "A" => "Be brief; consider decreasing the length to less than 150 characters.", 
      "B" => "Be specific; consider including a different action verb.", 
      "C" =>  "Highlight metrics; include a numeric measurement to show the impact of your skills."
    }

    descriptions.each_key{|key| result[key] ? result[key] = descriptions[key] : result.delete(key)}

    
    return result

    return 
  end

  def text_to_resume(text)
    OpenAI.configure do |config|
      config.access_token = ENV['OPENAI']
    end
    client = OpenAI::Client.new

    response = client.chat(
      parameters: {
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system',
            content: "Covert input to JSON with values that summarize this document. Use exactly this shape, keys, and data types: {
              personal: {
                  firstName: '',
                  lastName: '',
                  profession: '',
                  phoneNumber: '',
                  email: '',
                  website: ''
              },
              work: [{
                  companyName: '',
                  jobTitle: '',
                  city: '',
                  location: '',
                  from: '',
                  to: '',
                  description: [\"Bullet 1\", \"Bullet 2\", \"Bullet 3\"],
                  current: boolean
                }],
              education: [{
                  institutionName: '',
                  fieldOfStudy: '',
                  degreeType: '',
                  city: '',
                  location: '',
                  to: '',
                  description: 'Bullet 1\nBullet2\nBullet3',
                  current: boolean
                }],
              skills: ['Skill 1', 'Skill 2', 'Skill 3'],
          }. If 'skills' array would be empty, use two generic professional skills such as Time Management, Communication, Teamwork, or Problem Solving" },
          { role: 'user', content: text }
        ],
        response_format: { type: 'json_object' },
        temperature: 1.3,
        max_tokens: 4096
      }
    )
    # response = {'choices' => [{'message' => {'content' => '{Incomplete JSON STRING'}}]}

    begin
      resume = JSON.parse(response['choices'][0]['message']['content'])
      resume["work"].each do |work|
        bullets = work["description"] # Save the array of bullets
        work["description"] = work["description"].join("\n") # Change the 'description' to a \n separated string for frontend. TODO: Keep as array always.
        work["bulletRatings"] = []
        bullets.each{|bullet| work["bulletRatings"].push(gptEval(bullet))}
      end
      return JSON.unparse(resume)
    rescue JSON::ParserError
      BugReport.create!(
        body: "Invalid JSON: #{response['choices'][0]['message']['content']}",
        user_agent: "GenerateResumeJob"
      )
      return "-@-ErrorString-@-Invalid JSON: #{response['choices'][0]['message']['content']}"
    rescue StandardError => e
      return "-@-ErrorString-@-"+e.to_s
    end
  end
end
