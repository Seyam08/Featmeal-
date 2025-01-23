document.addEventListener("DOMContentLoaded", () => {
  loadOrders();
  let selectedMeal = localStorage.getItem("selectedMeal");
  if (selectedMeal && document.getElementById("mealType")) {
    document.getElementById("mealType").value = selectedMeal;
  }
});

function generateMealPlan() {
  let name = document.getElementById("name").value;
  let age = document.getElementById("age").value;
  let weight = document.getElementById("weight").value;
  let height = document.getElementById("height").value;
  let goal = document.getElementById("goal").value;

  if (!name || !age || !weight || !height) {
    alert("Please fill all the details.");
    return;
  }

  let calorieTarget =
    goal === "strength" ? 2800 : goal === "weightloss" ? 1800 : 2200;
  let protein = Math.round((calorieTarget * 0.25) / 4);
  let carbs = Math.round((calorieTarget * 0.5) / 4);
  let fats = Math.round((calorieTarget * 0.25) / 9);

  let mealPlanHTML = `
        <h3>${name}'s Meal Plan</h3>
        <p><strong>Calories:</strong> ${calorieTarget} kcal</p>
        <p><strong>Protein:</strong> ${protein}g</p>
        <p><strong>Carbs:</strong> ${carbs}g</p>
        <p><strong>Fats:</strong> ${fats}g</p>
        <h4>Suggested Meals:</h4>
        <div class="meal-container" style="display: flex; justify-content: center; gap: 20px; flex-wrap: wrap;">
            <div class="meal-card" style="text-align: center; width: 250px;">
                <img src="images/breakfast.jpg" alt="Breakfast" style="width: 250px; height: 250px; object-fit: cover;">
                <p><strong>Breakfast:</strong> Oats, Banana, Boiled Eggs</p>
                <h4 style="margin:0px;">Price: <span style="color: #ff8f00;">300&#2547;</span></h4>
                <button style="width: 100%;" onclick="redirectToOrderPage('Breakfast - Oats & Banana')">Order</button>
            </div>
            <div class="meal-card" style="text-align: center; width: 250px;">
                <img src="images/chickpea_egg.jpg" alt="Breakfast" style="width: 250px; height: 250px; object-fit: cover;">
                <p><strong>Breakfast:</strong> Chickpea, Egg Meal</p>
                <h4 style="margin:0px;">Price: <span style="color: #ff8f00;">400&#2547;</span></h4>
                <button style="width: 100%;" onclick="redirectToOrderPage('Breakfast - Chickpea & Egg')">Order</button>
            </div>
            <div class="meal-card" style="text-align: center; width: 250px;">
                <img src="images/lunch.jpg" alt="Lunch" style="width: 250px; height: 250px; object-fit: cover;">
                <p><strong>Lunch:</strong> Grilled Chicken, Brown Rice, Vegetables</p>
                <h4 style="margin:0px;">Price: <span style="color: #ff8f00;">500&#2547;</span></h4>
                <button style="width: 100%;" onclick="redirectToOrderPage('Lunch')">Order</button>
            </div>
            <div class="meal-card" style="text-align: center; width: 250px;">
                <img src="images/dinner.jpg" alt="Dinner" style="width: 250px; height: 250px; object-fit: cover;">
                <p><strong>Dinner:</strong> Salmon, Quinoa, Spinach</p>
                <h4 style="margin:0px;">Price: <span style="color: #ff8f00;">500&#2547;</span></h4>
                <button style="width: 100%;" onclick="redirectToOrderPage('Dinner')">Order</button>
            </div>
        </div>
    `;
  document.getElementById("mealPlan").innerHTML = mealPlanHTML;
}

function redirectToOrderPage(mealType) {
  localStorage.setItem("selectedMeal", mealType);
  window.location.href = "order.html";
}

function orderMeal() {
  let customerName = document.getElementById("customerName").value;
  let contactNumber = document.getElementById("contactNumber").value;
  let email = document.getElementById("email").value;
  let address = document.getElementById("address").value;
  let additionalNote = document.getElementById("additionalNote").value;
  let mealType = document.getElementById("mealType").value;

  if (!customerName || !contactNumber || !email || !address) {
    alert("Please fill all required fields.");
    return;
  }

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let order = {
    id: "ORD" + (orders.length + 1),
    name: customerName,
    contact: contactNumber,
    email: email,
    type: mealType,
    address: address,
    note: additionalNote || "N/A",
    status: "Pending",
  };

  orders.push(order);
  localStorage.setItem("orders", JSON.stringify(orders));
  document.getElementById("orderForm").reset();
  document.getElementById("thankYouMessage").style.display = "block";
  alert(`Your order for ${mealType} has been placed successfully!`);

  // Ensure orders load in admin panel
  loadOrders();
}

function loadOrders() {
  if (!document.querySelector("#orderTable tbody")) return;

  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let orderTable = document.querySelector("#orderTable tbody");
  orderTable.innerHTML = "";

  orders.forEach((order) => {
    let row = `<tr>
            <td>${order.id}</td>
            <td>${order.name}</td>
            <td>${order.contact}</td>
            <td>${order.email}</td>
            <td>${order.type}</td>
            <td>${order.address}</td>
            <td>${order.note}</td>
            <td>
                <select onchange="updateOrderStatus('${order.id}', this.value)">
                    <option value="Pending" ${
                      order.status === "Pending" ? "selected" : ""
                    }>Pending</option>
                    <option value="Delivered" ${
                      order.status === "Delivered" ? "selected" : ""
                    }>Delivered</option>
                </select>
            </td>
        </tr>`;
    orderTable.innerHTML += row;
  });
}

function updateOrderStatus(orderID, newStatus) {
  let orders = JSON.parse(localStorage.getItem("orders")) || [];
  let updatedOrders = orders.map((order) => {
    if (order.id === orderID) {
      order.status = newStatus;
    }
    return order;
  });
  localStorage.setItem("orders", JSON.stringify(updatedOrders));
  alert(`Order ${orderID} status updated to ${newStatus}`);
  loadOrders();
}
