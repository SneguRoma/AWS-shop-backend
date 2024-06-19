"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductsById = void 0;
const mock_data_1 = require("./mock-data");
/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} _event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */
const getProductsById = async (event) => {
    try {
        const productId = event.pathParameters?.productId;
        if (!productId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: 'Product ID is required' }),
            };
        }
        const product = mock_data_1.products.find((p) => p.id === productId);
        if (product) {
            return {
                statusCode: 200,
                body: JSON.stringify(product),
            };
        }
        return {
            statusCode: 200,
            body: JSON.stringify(mock_data_1.products),
        };
    }
    catch (err) {
        console.log(err);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }
};
exports.getProductsById = getProductsById;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2V0UHJvZHVjdC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImdldFByb2R1Y3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMkNBQXVDO0FBR3ZDOzs7Ozs7OztHQVFHO0FBRUksTUFBTSxlQUFlLEdBQUcsS0FBSyxFQUFFLEtBQTJCLEVBQWtDLEVBQUU7SUFDakcsSUFBSSxDQUFDO1FBQ0QsTUFBTSxTQUFTLEdBQUcsS0FBSyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUM7UUFDbEQsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ2IsT0FBTztnQkFDSCxVQUFVLEVBQUUsR0FBRztnQkFDZixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxDQUFDO2FBQzlELENBQUM7UUFDTixDQUFDO1FBRUQsTUFBTSxPQUFPLEdBQUcsb0JBQVEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssU0FBUyxDQUFDLENBQUM7UUFFekQsSUFBSSxPQUFPLEVBQUUsQ0FBQztZQUNWLE9BQU87Z0JBQ0gsVUFBVSxFQUFFLEdBQUc7Z0JBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDO2FBQ2hDLENBQUM7UUFDTixDQUFDO1FBQ0QsT0FBTztZQUNILFVBQVUsRUFBRSxHQUFHO1lBQ2YsSUFBSSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsb0JBQVEsQ0FBQztTQUNqQyxDQUFDO0lBQ04sQ0FBQztJQUFDLE9BQU8sR0FBRyxFQUFFLENBQUM7UUFDWCxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLE9BQU87WUFDSCxVQUFVLEVBQUUsR0FBRztZQUNmLElBQUksRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDO2dCQUNqQixPQUFPLEVBQUUscUJBQXFCO2FBQ2pDLENBQUM7U0FDTCxDQUFDO0lBQ04sQ0FBQztBQUNMLENBQUMsQ0FBQztBQS9CVyxRQUFBLGVBQWUsbUJBK0IxQiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFQSUdhdGV3YXlQcm94eUV2ZW50LCBBUElHYXRld2F5UHJveHlSZXN1bHQgfSBmcm9tICdhd3MtbGFtYmRhJztcclxuaW1wb3J0IHsgcHJvZHVjdHMgfSBmcm9tICcuL21vY2stZGF0YSc7XHJcblxyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEV2ZW50IGRvYzogaHR0cHM6Ly9kb2NzLmF3cy5hbWF6b24uY29tL2FwaWdhdGV3YXkvbGF0ZXN0L2RldmVsb3Blcmd1aWRlL3NldC11cC1sYW1iZGEtcHJveHktaW50ZWdyYXRpb25zLmh0bWwjYXBpLWdhdGV3YXktc2ltcGxlLXByb3h5LWZvci1sYW1iZGEtaW5wdXQtZm9ybWF0XHJcbiAqIEBwYXJhbSB7T2JqZWN0fSBfZXZlbnQgLSBBUEkgR2F0ZXdheSBMYW1iZGEgUHJveHkgSW5wdXQgRm9ybWF0XHJcbiAqXHJcbiAqIFJldHVybiBkb2M6IGh0dHBzOi8vZG9jcy5hd3MuYW1hem9uLmNvbS9hcGlnYXRld2F5L2xhdGVzdC9kZXZlbG9wZXJndWlkZS9zZXQtdXAtbGFtYmRhLXByb3h5LWludGVncmF0aW9ucy5odG1sXHJcbiAqIEByZXR1cm5zIHtPYmplY3R9IG9iamVjdCAtIEFQSSBHYXRld2F5IExhbWJkYSBQcm94eSBPdXRwdXQgRm9ybWF0XHJcbiAqXHJcbiAqL1xyXG5cclxuZXhwb3J0IGNvbnN0IGdldFByb2R1Y3RzQnlJZCA9IGFzeW5jIChldmVudDogQVBJR2F0ZXdheVByb3h5RXZlbnQpOiBQcm9taXNlPEFQSUdhdGV3YXlQcm94eVJlc3VsdD4gPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBwcm9kdWN0SWQgPSBldmVudC5wYXRoUGFyYW1ldGVycz8ucHJvZHVjdElkO1xyXG4gICAgICAgIGlmICghcHJvZHVjdElkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgICAgICBzdGF0dXNDb2RlOiA0MDAsXHJcbiAgICAgICAgICAgICAgICBib2R5OiBKU09OLnN0cmluZ2lmeSh7IG1lc3NhZ2U6ICdQcm9kdWN0IElEIGlzIHJlcXVpcmVkJyB9KSxcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHByb2R1Y3QgPSBwcm9kdWN0cy5maW5kKChwKSA9PiBwLmlkID09PSBwcm9kdWN0SWQpO1xyXG5cclxuICAgICAgICBpZiAocHJvZHVjdCkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgc3RhdHVzQ29kZTogMjAwLFxyXG4gICAgICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocHJvZHVjdCksXHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDIwMCxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkocHJvZHVjdHMpLFxyXG4gICAgICAgIH07XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHN0YXR1c0NvZGU6IDUwMCxcclxuICAgICAgICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoe1xyXG4gICAgICAgICAgICAgICAgbWVzc2FnZTogJ3NvbWUgZXJyb3IgaGFwcGVuZWQnLFxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xyXG4iXX0=