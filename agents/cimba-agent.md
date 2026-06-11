# Telco Customer Services — Agent Knowledge Document

## Business Contexts

### Customer Churn Rate

Customer churn rate is calculated as the percentage of customers who discontinued service within a given quarter. The formula is:

```
Churn Rate = (Customers Lost in Quarter / Total Customers at Start of Quarter) * 100
```

A customer is considered "churned" when their `tenure_in_months` stops incrementing and they are no longer present in the current quarter's snapshot. Churn rate above 2.5% per quarter is considered critical and requires immediate executive review.

### Monthly Revenue Per User (MRPU)

Monthly Revenue Per User is computed from the `monthly_charge` field. It represents the average monthly billing amount across all active customers. MRPU is segmented by `contract` type (Month-to-Month, One Year, Two Year) for executive dashboards. The target MRPU for 2025 is $65.00 across all segments.

### Customer Lifetime Value (CLV)

Customer Lifetime Value is estimated using: `CLV = (monthly_charge * tenure_in_months) - total_refunds`. This metric helps prioritize retention efforts. Customers with CLV above $5,000 are classified as "high-value" and receive priority support routing.

### Referral Program Effectiveness

The referral program is tracked via `referred_a_friend` (boolean) and `number_of_referrals` (count). A successful referral is one where the referred customer stays active for at least 3 months. Referral conversion rate = `number_of_referrals / total_referral_invitations_sent`. Customers with 3+ referrals qualify for the "Ambassador" tier with 15% monthly discount.

### Average Revenue Per Account (ARPA)

ARPA is calculated as `total_revenue / count` where count represents the number of service lines per customer. Multi-line customers (count > 1) typically have 40% higher ARPA than single-line customers. ARPA is the primary metric for the sales team's quarterly targets.

### High-Value Customer Segment

A customer is classified as "high-value" when ALL of the following conditions are met:
- `tenure_in_months` >= 24
- `monthly_charge` >= 80
- `contract` is "One Year" or "Two Year"
- `total_revenue` >= 2000

High-value customers represent approximately 18% of the customer base but contribute 45% of total revenue.

### Data Overage Revenue

Data overage revenue is tracked in `total_extra_data_charges`. Customers on plans without `unlimited_data` who exceed their monthly GB allowance are charged $10 per additional 5GB block. The average overage per non-unlimited customer is $15/month. This revenue stream is declining as more customers migrate to unlimited plans.

### Long Distance Usage Patterns

Long distance usage is captured in `avg_monthly_long_distance_calls` (call count) and `total_long_distance_charges` (revenue). Customers averaging more than 50 long distance calls per month are flagged as "heavy LD users" and are candidates for the International Calling Add-on ($15/month for unlimited international calls to 60 countries).

### Contract Renewal Risk Score

Customers approaching contract end within 60 days with Month-to-Month contracts and declining usage patterns (monthly_charge decrease over last 3 months) are assigned a renewal risk score. Risk categories: Low (0-30), Medium (31-60), High (61-100). Customers with risk score > 70 are automatically routed to the retention team.

### Service Bundle Penetration

Bundle penetration measures how many services a customer subscribes to. Core services: `phone_service`, `internet_service`. Add-on services: `online_security`, `online_backup`, `device_protection_plan`, `premium_tech_support`, `streaming_tv`, `streaming_movies`, `streaming_music`. Customers with 5+ services have 60% lower churn probability than those with 1-2 services.

---

## Playbooks

### Customer Churn Root Cause Analysis

**Objective:** Identify the primary drivers of customer churn and quantify their impact on revenue.

**Steps:**
1. Segment churned customers by `contract` type, `internet_type`, and `tenure_in_months` buckets (0-6, 7-12, 13-24, 25+)
2. Calculate churn rate for each segment and compare against the overall average
3. Analyze the relationship between `monthly_charge` and churn — do higher-paying customers churn more?
4. Check if customers with `premium_tech_support` = Yes have lower churn rates
5. Evaluate the impact of `offer` types on retention — which promotional offers correlate with longer tenure?
6. Calculate the revenue impact: `SUM(monthly_charge * remaining_contract_months)` for churned customers
7. Cross-reference with `paperless_billing` and `payment_method` to identify friction points
8. Produce a prioritized list of intervention recommendations ranked by potential revenue recovery

### Revenue Optimization Analysis

**Objective:** Identify opportunities to increase ARPA through upselling and cross-selling.

**Steps:**
1. Profile customers by current service bundle (count of active add-on services)
2. Identify customers with `internet_service` = Yes but missing `online_security` or `online_backup` — these are prime upsell targets
3. Segment by `internet_type` (DSL, Fiber Optic, Cable) and compare `average_monthly_gb_download` to identify bandwidth upgrade candidates
4. Analyze customers with `streaming_tv` = Yes but `streaming_movies` = No (and vice versa) for cross-sell opportunities
5. Calculate the revenue uplift potential: estimated additional monthly_charge if top upsell recommendations are accepted
6. Rank opportunities by customer CLV to prioritize high-value customers
7. Generate a target list with customer_id, recommended action, and expected revenue impact

### Referral Program Performance Deep Dive

**Objective:** Evaluate the referral program's ROI and identify characteristics of top referrers.

**Steps:**
1. Filter customers where `referred_a_friend` = Yes and calculate referral rate by `contract` type
2. Analyze `number_of_referrals` distribution — what percentage of referrers make 1 vs 2+ referrals?
3. Compare `tenure_in_months` and `monthly_charge` of referrers vs non-referrers
4. Calculate the estimated revenue from referred customers (assume each referral = new customer at average MRPU)
5. Identify the profile of "super referrers" (3+ referrals): what contract, internet_type, and service bundle do they have?
6. Compute referral program ROI: (Revenue from referred customers - Referral incentive costs) / Referral incentive costs

### Quarterly Business Review (QBR) Dashboard

**Objective:** Generate the standard quarterly metrics package for executive review.

**Steps:**
1. Calculate total customers, new customers, and churned customers for the quarter
2. Compute ARPA, MRPU, and total_revenue trends vs previous quarter
3. Break down revenue by category: monthly_charge, total_long_distance_charges, total_extra_data_charges
4. Segment customers by contract type and show migration patterns (Month-to-Month → One Year → Two Year)
5. Show service adoption rates for each add-on service (online_security, streaming_tv, etc.)
6. Calculate net revenue retention rate: (Current quarter revenue from existing customers / Previous quarter total revenue) * 100
7. Highlight top 10 customers by total_revenue and any changes in their service profile

---

## Instructions

### General Agent Instructions

When answering questions about the telco customer data, always consider the following:

- All monetary values (monthly_charge, total_charges, total_revenue, total_refunds, total_extra_data_charges, total_long_distance_charges) are in USD.
- When calculating averages, exclude customers with NULL or zero values unless explicitly asked to include them.
- The `quarter` field uses the format "Q1 2025", "Q2 2025", etc. Always clarify which quarter is being analyzed if not specified by the user.
- When presenting churn analysis, always include both the count and percentage, and compare against the benchmark churn rate of 2.5% per quarter.
- Round all monetary values to 2 decimal places and percentages to 1 decimal place.
- When grouping by tenure, use these standard buckets unless the user specifies otherwise: New (0-6 months), Developing (7-12), Established (13-24), Loyal (25+ months).

### Data Quality Notes

The `count` field represents the number of service lines associated with a customer account. Most customers have count = 1, but business customers may have count > 1. When computing per-customer metrics, divide by count to get per-line values. The `total_charges` field is a cumulative lifetime value and should NOT be confused with `monthly_charge` which is the current monthly billing amount. The relationship is approximately: `total_charges ≈ monthly_charge * tenure_in_months`, but may differ due to plan changes and promotions.

### Response Formatting

Always present results in tables when comparing 3+ categories. Use bullet points for key findings. Include a "Key Takeaway" section at the end of every analysis summarizing the 2-3 most important insights. When the user asks about trends, include quarter-over-quarter percentage changes.

---

## Table Description

### telco_customer_services

This table contains a comprehensive customer-level dataset for a telecommunications company. Each row represents a unique customer account with their demographic information, service subscriptions, usage metrics, and financial data. The table is used for customer analytics including churn prediction, revenue forecasting, cross-sell/upsell analysis, and quarterly business reviews. Data is refreshed monthly with the `quarter` field indicating the reporting period.

### telco_customer_demographics

Customer demographic attributes keyed by `customer_id`. Holds age, gender, marital/partner status, dependents, and senior-citizen flags. Joined to `telco_customer_services` on `customer_id` to segment churn, revenue, and adoption metrics by demographic cohort.

### telco_customer_location

Geographic information for each customer keyed by `customer_id` — city, state, latitude/longitude, and the `zip_code` that links to `telco_zip_code_population`. Used for regional analysis of churn, service coverage, and market penetration.

### telco_customer_status

Lifecycle and churn outcome per `customer_id` — churn label, churn reason/category, customer status (Stayed/Churned/Joined), satisfaction score, and Customer Lifetime Value band. This is the authoritative churn-label source for prediction and root-cause analysis; join to `telco_customer_services` on `customer_id`.

### telco_zip_code_population

Reference table keyed by `zip_code` giving the estimated population per ZIP. Joined via `telco_customer_location.zip_code` to normalize customer counts and churn against population density for market-level analysis.

---

## Column Descriptions

### customer_id
Unique identifier for each customer account. Format: alphanumeric string (e.g., "CUST-00001"). This is the primary key and is used to join with other customer-related tables such as support tickets and billing history.

### count
Number of service lines associated with the customer account. Residential customers typically have count = 1. Small business accounts may have count = 2-5. This field is used as a denominator when calculating per-line metrics like ARPA.

### quarter
The reporting quarter in which this customer snapshot was taken. Format: "Q1 2025". Each customer appears once per quarter. Used for time-series analysis and quarter-over-quarter comparisons. Historical data is available from Q1 2023.

### referred_a_friend
Boolean flag indicating whether the customer has ever referred another person through the referral program. Values: Yes/No. This is a lifetime flag — once set to Yes, it remains Yes even if the referred customer later churns.

### number_of_referrals
Total count of successful referrals made by this customer. A referral is "successful" when the referred person activates a service plan. Range: 0 to 20+. Customers with 0 referrals may still have `referred_a_friend` = No if they never participated.

### tenure_in_months
Number of months the customer has been with the company since their initial service activation. Starts at 1 (not 0) on the activation month. Used for customer lifecycle analysis and churn prediction models. Longer tenure generally correlates with lower churn probability.

### offer
The promotional offer active on the customer's account. Values include: "Offer A" (20% discount for 6 months), "Offer B" (free premium tech support for 12 months), "Offer C" ($100 credit), "Offer D" (free streaming bundle for 3 months), "Offer E" (buy one get one line free), or "None" (no active promotion). Only one offer can be active at a time.

### phone_service
Whether the customer subscribes to the landline phone service. Values: Yes/No. This is one of the two core services (along with internet_service). Approximately 70% of customers have phone service.

### avg_monthly_long_distance_calls
Average number of long distance calls made per month over the customer's tenure. Decimal value. Only populated when `phone_service` = Yes. Used to identify heavy long-distance users for targeted plan recommendations.

### multiple_lines
Whether the customer has multiple phone lines on their account. Values: Yes/No/No phone service. Only applicable when `phone_service` = Yes. Customers with multiple lines have higher ARPA but similar churn rates.

### internet_service
Whether the customer subscribes to internet service. Values: Yes/No. This is the highest-revenue core service. Approximately 85% of customers have internet service. Customers without internet service have significantly lower monthly_charge.

### internet_type
The technology type for the customer's internet connection. Values: "DSL", "Fiber Optic", "Cable", or NULL (if internet_service = No). Fiber Optic customers have the highest satisfaction scores and lowest churn. DSL customers are the most price-sensitive segment.

### average_monthly_gb_download
Average monthly data download in gigabytes. Decimal value, calculated over the customer's tenure. Only populated when `internet_service` = Yes. Used to assess bandwidth utilization and identify upgrade candidates. The network considers > 500 GB/month as "heavy usage".

### online_security
Whether the customer subscribes to the online security add-on service. Values: Yes/No/No internet service. Priced at $10/month. Customers with online security have 15% lower churn rates. Often bundled with online_backup in promotional offers.

### online_backup
Whether the customer subscribes to the cloud backup add-on service. Values: Yes/No/No internet service. Priced at $10/month. Popular among customers with high data usage (average_monthly_gb_download > 200 GB).

### device_protection_plan
Whether the customer has enrolled in the device protection plan. Values: Yes/No/No internet service. Priced at $12/month. Covers hardware replacement for routers and modems. Adoption rate is approximately 35%.

### premium_tech_support
Whether the customer subscribes to premium technical support. Values: Yes/No/No internet service. Priced at $15/month. Provides 24/7 priority phone support and in-home service visits. Customers with premium tech support report 25% higher satisfaction and 20% lower churn.

### streaming_tv
Whether the customer subscribes to the streaming TV service. Values: Yes/No/No internet service. Priced at $15/month. Includes 200+ live channels. Often cross-sold with streaming_movies.

### streaming_movies
Whether the customer subscribes to the on-demand movie streaming service. Values: Yes/No/No internet service. Priced at $12/month. Includes access to 10,000+ titles. Customers with both streaming_tv and streaming_movies have the highest content engagement.

### streaming_music
Whether the customer subscribes to the music streaming service. Values: Yes/No/No internet service. Priced at $8/month. Newest add-on service launched in Q3 2024. Adoption is growing at 5% quarter-over-quarter.

### unlimited_data
Whether the customer has unlimited data on their internet plan. Values: Yes/No/No internet service. Unlimited plans are $10/month more than capped plans. Customers on capped plans generate additional revenue through `total_extra_data_charges` but have higher churn rates.

### contract
The customer's contract type. Values: "Month-to-Month", "One Year", "Two Year". Month-to-Month customers have the highest churn rate (approximately 4x higher than Two Year contract customers). Contract type is the single strongest predictor of churn in our models.

### paperless_billing
Whether the customer has opted for paperless billing. Values: Yes/No. Approximately 60% of customers use paperless billing. Interestingly, paperless billing customers have slightly higher churn rates, possibly due to lower engagement with billing communications.

### payment_method
The customer's payment method. Values: "Bank Withdrawal", "Credit Card", "Mailed Check". Bank Withdrawal customers have the lowest churn (automatic payments reduce friction). Mailed Check customers have the highest churn and are targeted for payment method migration campaigns.

### monthly_charge
The customer's current monthly billing amount in USD. Range: $18.25 to $118.75. This reflects the sum of all subscribed services minus any active promotional discounts. Changes when customers add/remove services or when promotions expire.

### total_charges
Cumulative total amount billed to the customer over their entire tenure in USD. Approximately equal to `monthly_charge * tenure_in_months` but may vary due to mid-cycle plan changes, promotional periods, and one-time charges. Used for lifetime value calculations.

### total_refunds
Cumulative total refunds issued to the customer in USD. Refunds are issued for service outages (>4 hours), billing errors, and goodwill credits. High refund amounts relative to total_charges may indicate service quality issues for that customer.

### total_extra_data_charges
Cumulative overage charges for exceeding data caps in USD. Only applicable to customers with `unlimited_data` = No. Charged at $10 per 5GB block over the monthly limit. This field is $0 for unlimited data customers.

### total_long_distance_charges
Cumulative long distance calling charges in USD. Only applicable to customers with `phone_service` = Yes. Calculated based on call duration and destination. Customers on the International Calling Add-on ($15/month) have $0 in per-call long distance charges.

### total_revenue
Total revenue generated from the customer in USD. Calculated as: `total_charges + total_extra_data_charges + total_long_distance_charges - total_refunds`. This is the definitive revenue metric for customer-level profitability analysis.
