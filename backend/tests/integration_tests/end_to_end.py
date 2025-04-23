import pytest
from rest_framework.test import APIClient
from django.urls import reverse
from bson import ObjectId 

@pytest.fixture
def api_client():
    return APIClient()

@pytest.mark.django_db
class TestProductCategoryIntegration:

    def test_add_category_to_product(self, api_client):
        # Create initial category
        category_data_1 = {"category_name": "Alpha", "description": "First category", "is_active": True}
        category_1_response = api_client.post(reverse("category_list"), category_data_1, format="json")
        category_1_id = category_1_response.data["id"]
        
        # Create product with first category
        product_data = {
            "name": "Item1",
            "brand": "BrandA",
            "price_in_RS": 100,
            "quantity": 1,
            "manufacture_date": "2024-01-01",
            "expiry_date": "2025-01-01",
            "category": [category_1_id]
        }
        product_response = api_client.post("/products/", product_data, format="json")
        product_id = product_response.data["id"]
        
        # Create second category
        category_data_2 = {"category_name": "Beta", "description": "Second category", "is_active": True}
        category_2_response = api_client.post(reverse("category_list"), category_data_2, format="json")
        category_2_id = category_2_response.data["id"]
        
        # Add second category to product
        add_category_data = {"category_id": category_2_id, "action": "add"}
        add_category_response = api_client.put(f"/products/{product_id}/", add_category_data, format="json")
        
        assert add_category_response.status_code == 200
        assert "Beta" in add_category_response.data["category"]
        assert "Alpha" in add_category_response.data["category"]

    def test_remove_category_from_product(self, api_client):
        # Create two categories
        category_data_1 = {"category_name": "CatA", "description": "Category A", "is_active": True}
        category_1_response = api_client.post(reverse("category_list"), category_data_1, format="json")
        category_1_id = category_1_response.data["id"]
        
        category_data_2 = {"category_name": "CatB", "description": "Category B", "is_active": True}
        category_2_response = api_client.post(reverse("category_list"), category_data_2, format="json")
        category_2_id = category_2_response.data["id"]
        
        # Create product with both categories
        product_data = {
            "name": "Item2",
            "brand": "BrandB",
            "price_in_RS": 200,
            "quantity": 2,
            "manufacture_date": "2024-01-01",
            "expiry_date": "2025-01-01",
            "category": [category_1_id, category_2_id]
        }
        product_response = api_client.post("/products/", product_data, format="json")
        product_id = product_response.data["id"]
        
        # Remove second category
        remove_category_data = {"category_id": category_2_id, "action": "remove"}
        remove_category_response = api_client.put(f"/products/{product_id}/", remove_category_data, format="json")
        
        assert remove_category_response.status_code == 200
        assert "CatB" not in remove_category_response.data["category"]
        assert "CatA" in remove_category_response.data["category"]

    def test_invalid_action(self, api_client):
        # Create category and product
        category_data = {"category_name": "X", "description": "X", "is_active": True}
        category_response = api_client.post(reverse("category_list"), category_data, format="json")
        category_id = category_response.data["id"]
        
        product_data = {
            "name": "ItemX",
            "brand": "BrandX",
            "price_in_RS": 10,
            "quantity": 1,
            "manufacture_date": "2024-01-01",
            "expiry_date": "2025-01-01",
            "category": [category_id]
        }
        product_response = api_client.post("/products/", product_data, format="json")
        product_id = product_response.data["id"]
        
        # Test invalid action
        invalid_action_data = {"category_id": category_id, "action": "foobar"}
        invalid_action_response = api_client.put(f"/products/{product_id}/", invalid_action_data, format="json")
        
        assert invalid_action_response.status_code == 400

    def test_missing_fields_in_data(self, api_client):
        # Test category creation with missing required field
        category_data = {"description": "Missing category name", "is_active": True}
        category_response = api_client.post(reverse("category_list"), category_data, format="json")
        
        assert category_response.status_code == 400
        assert "category_name" in category_response.json()

    def test_end_to_end_category_product_flow(self, api_client):
        # 1. Create first category
        category_data_1 = {"category_name": "Tech", "description": "All tech products", "is_active": True}
        category_1_response = api_client.post(reverse("category_list"), category_data_1, format="json")
        assert category_1_response.status_code == 201
        category_1_id = category_1_response.data["id"]

        # 2. Create product with first category
        product_data = {
            "name": "Phone",
            "brand": "OnePlus",
            "price_in_RS": 1000,
            "quantity": 5,
            "manufacture_date": "2024-01-01",
            "expiry_date": "2026-01-01",
            "category": [category_1_id]
        }
        product_response = api_client.post(reverse("product_list"), product_data, format="json")
        assert product_response.status_code == 201
        product_id = product_response.data["id"]
        assert "Tech" in product_response.data["category"]

        # 3. Create second category
        category_data_2 = {"category_name": "Mobiles", "description": "Smartphones only", "is_active": True}
        category_2_response = api_client.post(reverse("category_list"), category_data_2, format="json")
        assert category_2_response.status_code == 201
        category_2_id = category_2_response.data["id"]

        # 4. Add second category to product
        add_category_data = {"category_id": category_2_id, "action": "add"}
        add_category_response = api_client.put(f"/products/{product_id}/", add_category_data, format="json")
        assert add_category_response.status_code == 200
        assert "Mobiles" in add_category_response.data["category"]
        assert "Tech" in add_category_response.data["category"]

        # 5. Verify product has both categories
        product_response = api_client.get(f"/products/{product_id}/")
        assert product_response.status_code == 200
        assert sorted(product_response.data["category"]) == sorted(["Tech", "Mobiles"])

        # 6. Remove second category
        remove_category_data = {"category_id": category_2_id, "action": "remove"}
        remove_category_response = api_client.put(f"/products/{product_id}/", remove_category_data, format="json")
        assert remove_category_response.status_code == 200
        assert "Mobiles" not in remove_category_response.data["category"]
        assert "Tech" in remove_category_response.data["category"]

        # 7. Verify product has only first category
        product_response = api_client.get(f"/products/{product_id}/")
        assert product_response.status_code == 200
        assert product_response.data["category"] == ["Tech"]

    def test_end_to_end_with_invalid_values(self, api_client):
        # 1. Create a valid category
        valid_category_data = {"category_name": "Electronics", "description": "Electronic gadgets", "is_active": True}
        category_response = api_client.post(reverse("category_list"), valid_category_data, format="json")
        assert category_response.status_code == 201
        category_id = category_response.data["id"]
        
        # 2. Test negative price validation
        invalid_price_data = {
            "name": "BadPhone",
            "brand": "TestBrand",
            "price_in_RS": -500,
            "quantity": 5,
            "manufacture_date": "2024-01-01",
            "expiry_date": "2026-01-01",
            "category": [category_id]
        }
        invalid_price_response = api_client.post(reverse("product_list"), invalid_price_data, format="json")
        assert invalid_price_response.status_code == 400
        assert "Price cannot be negative" in invalid_price_response.data.get("error", "")
        
        # 3. Test invalid date validation
        invalid_dates_data = {
            "name": "DatePhone",
            "brand": "TestBrand",
            "price_in_RS": 500,
            "quantity": 5,
            "manufacture_date": "2024-05-01",
            "expiry_date": "2024-01-01",
            "category": [category_id]
        }
        invalid_dates_response = api_client.post(reverse("product_list"), invalid_dates_data, format="json")
        assert invalid_dates_response.status_code == 400
        assert "Expiry date cannot be before manufacture date" in invalid_dates_response.data.get("error", "")
        
        # 4. Create valid product
        valid_product_data = {
            "name": "GoodPhone",
            "brand": "TestBrand",
            "price_in_RS": 500,
            "quantity": 5,
            "manufacture_date": "2024-01-01",
            "expiry_date": "2026-01-01",
            "category": [category_id]
        }
        valid_product_response = api_client.post(reverse("product_list"), valid_product_data, format="json")
        assert valid_product_response.status_code == 201
        product_id = valid_product_response.data["id"]
        
        # 5. Test non-existent category
        non_existent_category_id = str(ObjectId())
        add_non_existent_category_data = {"category_id": non_existent_category_id, "action": "add"}
        non_existent_category_response = api_client.put(f"/products/{product_id}/", add_non_existent_category_data, format="json")
        assert non_existent_category_response.status_code == 404
        
        # 6. Test invalid action type
        invalid_action_data = {"category_id": category_id, "action": "invalid_action"}
        invalid_action_response = api_client.put(f"/products/{product_id}/", invalid_action_data, format="json")
        assert invalid_action_response.status_code == 400

        # 7. Verify product data integrity
        product_response = api_client.get(f"/products/{product_id}/")
        assert product_response.status_code == 200
        assert product_response.data["category"] == ["Electronics"]