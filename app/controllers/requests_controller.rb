# frozen_string_literal: true

class RequestsController < ApplicationController
  skip_before_action :track_session, only: :check
  def check
    id = params['id']
    request = Request.find_by(id:)

    if request
      render json: request.to_json
    else
      render json: { errors: 'Resource not found' }
    end
  end
end
