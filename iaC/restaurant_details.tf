resource "aws_dynamodb_table" "basic-dynamodb-table" {
  name           = "restaurant_details"
  billing_mode   = "PROVISIONED"
  read_capacity  = 20
  write_capacity = 20
  hash_key       = "restaurant_id"

  attribute {
    name = "restaurant_id"
    type = "S"
  }
  attribute {
    name = "restaurant_name"
    type = "S"
  }
  attribute {
    name = "address"
    type = "S"
  }
  attribute {
    name = "timings"
    type = "M"
    attribute {
      name="monday"
      type="M"
      attribute {
        attribute="opening_time"
        type="N"
      }
      attribute {
        attribute="closing_time"
        type="N"
      }
    }
    attribute {
      name="tuesday"
      type="M"
      attribute {
        attribute="opening_time"
        type="N"
      }
      attribute {
        attribute="closing_time"
        type="N"
      }
    }
    attribute {
      name="wednesday"
      type="M"
      attribute {
        attribute="opening_time"
        type="N"
      }
      attribute {
        attribute="closing_time"
        type="N"
      }
    }
    attribute {
      name="thursday"
      type="M"
      attribute {
        attribute="opening_time"
        type="N"
      }
      attribute {
        attribute="closing_time"
        type="N"
      }
    }
    attribute {
      name="friday"
      type="M"
      attribute {
        attribute="opening_time"
        type="N"
      }
      attribute {
        attribute="closing_time"
        type="N"
      }
    }
    attribute {
      name="saturday"
      type="M"
      attribute {
        attribute="opening_time"
        type="N"
      }
      attribute {
        attribute="closing_time"
        type="N"
      }
    }
    attribute {
      name="sunday"
      type="M"
      attribute {
        attribute="opening_time"
        type="N"
      }
      attribute {
        attribute="closing_time"
        type="N"
      }
    }
  }
  attribute{
    name="images"
    type="L"
    attribute{
      type="S"
    }
  }
  attribute{
    name="restaurant_reviews"
    type="L"
    attribute{
      type="M"
      attribute{
        name="user_id"
        type="S"
      }
      attribute{
        name="review"
        type="S"
      }
      attribute{
        name="rating"
        type="N"
      }
    }
  }
  attribute {
    name="menu"
    type="L"
    attribute {
      type="M"
      attribute {
        name="name"
        type="S"
      }
      attribute {
        name="is_available"
        type="BOOL"
      }
      attribute {
        name="price"
        type="N"
      }
      attribute {
        name="image"
        type="S"
      }
      attribute {
        name="percent_offer"
        type="N"
      }
      attribute {
        name="reviews"
        type="L"
        attribute {
          type="M"
          attribute {
            name="user_id"
            type="S"
          }
          attribute {
            name="review"
            type="S"
          }
          attribute {
            name="rating"
            type="N"
          }
        }
      }
    }
  }
  attribute {
    type="S"
    name="restaurant_offer"
  }
  attribute {
    name="tables"
    type="L"
    attribute {
      type="M"
      attribute {
        name="number"
        type="N"
      }
      attribute {
        type="N"
        name="size"
      }
    }
  }
  attribute {
    name="is_open"
    type="BOOL"
  }
}