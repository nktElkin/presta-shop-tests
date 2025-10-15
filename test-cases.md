# Authorization

## User registration flow
### CT-AUTH-001: Successful register as a new user
**Type:** component

### CT-AUTH-002: Filed registration with alreadu exists credentials
**Type:** component

...just for example

## Login form
### CT-AUTH-003: Success login with valid credentials
**Type:** component

### CT-AUTH-004: Faild login - invalid password
**Type:** component

### CT-AUTH-005: Faild login - invalid login
**Type:** component

### CT-AUTH-006: Faild login - filds constraint
**Type:** component

### CT-AUTH-007: Faild login - filds constraint
**Type:** component

## Login/Logout actions
### CT-AUTH-008: Manual logout
**Type:** component

### CT-AUTH-009: User logged out due to expired/missing session data
**Type:** component


# User flow
## User buy product using favorits
### E2E-UF-001: Complete purchase flow from favorites to checkout
**Type:** e2e

#### Description
User completes full purchase journey by adding product to favorites, managing favorites and cart, and proceeding through checkout until payment notification.

#### Steps
1. User adds product to favorites with different size from main page
2. User removes product from favorites from favorites page
3. User adds product from favorites to cart 
4. User shares cart link
5. User increases/decreases number of item by 1 in cart
6. User fills mandatory fields with valid data in check-out form
7. User chooses delivery type
8. User sees "no payment gate" notification

#### Expected Result
User successfully completes the purchase flow and receives payment gateway notification as payment method wasn't implemented in test web.










# Test data
sex: m
username: hataviy
second name: fanlvr
email: hataviy619@fanlvr.com
password: Hataviy619@fanlvr.com