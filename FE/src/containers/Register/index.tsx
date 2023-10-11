import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Card } from 'antd';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Notification } from '../../components'

interface AccountRegister {
    name: string;
    email: string;
    password: string;
}

const initialValues = {
    name: '',
    email: '',
    password: ''
}

const validationSchema = yup.object({
    name: yup.string().required('Name must exist'),
    email: yup.string()
        .email('Invalid email format')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid email format. Must include domain.')
        .required('Email must exist')
        .min(10),
    password: yup.string().required('Password must exist').min(8, 'Minimum of 8 characters')
})

const Register: React.FC = () => {

    const navigate = useNavigate();

    async function postRegisterData(values: AccountRegister) {
        try {
            const fetching = await fetch('https://mock-api.arikmpt.com/api/user/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            if (!fetching.ok) {
                throw new Error('Error registering user');
            }
            Notification('success', 'Register', 'Registration successful!');
            navigate('/login');
        } catch (error) {
            console.error('Error registering user:', error);
        }
    }

    async function handleSubmit(values: AccountRegister) {
        try {
            if (formik.isValid) {
                await postRegisterData(values);
            }else{
                Notification('error', 'Register error', 'Your input probably wrong, try other stuff');
            }
        } catch (error) {
            console.error('Error in handleSubmit:', error);
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: validationSchema
    })

    return (
        <Card title="Please Register To Our Platform" headStyle={{ textAlign: 'center' }} style={{ width: '60vw' }}>
            <Form onFinish={formik.handleSubmit}>
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please input your Name!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange('name')}
                        status={formik.errors.name && 'error'}
                    />
                </Form.Item>
                <Form.Item
                    name="email"
                    hasFeedback
                    validateStatus={formik.touched.email && formik.errors.email ? 'error' : 'success'}
                    help={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
                >
                    <>
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Email"
                            value={formik.values.email}
                            onChange={formik.handleChange('email')}
                        />
                    </>

                </Form.Item>
                <Form.Item
                    name="password"
                    hasFeedback
                    validateStatus={formik.touched.password && formik.errors.password ? 'error' : 'success'}
                    help={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="password"
                        placeholder="Password"
                        value={formik.values.password}
                        onChange={formik.handleChange('password')}
                        status={formik.errors.password && 'error'}
                    />
                </Form.Item>
                <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent: 'space-around' }}>
                    <Button type="primary" htmlType="submit">
                        Register
                    </Button>
                    <Button onClick={() => {navigate('/login')}} type="default">Login now!</Button>
                </Space>
            </Form>
        </Card>
    );
};

export default Register;