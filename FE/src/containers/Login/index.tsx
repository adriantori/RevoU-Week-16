import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Card } from 'antd';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../components';
import { API_URL } from '../../constants';

interface AccountLogin {
    email: string;
    password: string;
}

const initialValues = {
    email: '',
    password: ''
};

const validationSchema = yup.object({
    email: yup.string().required(),
    password: yup.string().required()
});

const Login: React.FC = () => {
    const navigate = useNavigate();

    async function postLoginData(values: AccountLogin, navigate: Function) {
        try {
            const fetching = await fetch(API_URL + '/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            if (!fetching.ok) {
                throw new Error('Error login user');
            }
            const response = await fetching.json();

            localStorage.setItem('token', response.data.token);

            Notification('success', 'Logged in', 'Login successful!');
            console.log('postLoginData called');
            navigate('/');
        } catch (error) {
            Notification('error', 'Login Error', 'Login information is wrong');
        }
    }

    const handleSubmit = async (values: AccountLogin) => {
        try {
            if (formik.isValid) {
                await postLoginData(values, navigate);
            }
        } catch (error) {
            Notification('error', 'Fatal Error', 'Submit data error!');
        }
    };

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: validationSchema
    });

    return (
        <Card title="Please Login To Continue" headStyle={{ textAlign: 'center' }} style={{ width: '60vw' }}>
            <Form onFinish={formik.handleSubmit}>
                <Form.Item
                    name="email"
                    rules={[{ required: true, message: 'Please input your Email!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder={"Email"}
                        value={formik.values.email}
                        onChange={formik.handleChange('email')}
                        status={formik.errors.email && 'error'}
                    />
                </Form.Item>
                <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your Password!' }]}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder={"Password"}
                        value={formik.values.password}
                        onChange={formik.handleChange('password')}
                        status={formik.errors.password && 'error'}
                    />
                </Form.Item>
                <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    <Button onClick={() => { navigate('/register') }} type="default" className="login-form-button">register now!</Button>
                </Space>
            </Form>
        </Card>
    );
};

export default Login;