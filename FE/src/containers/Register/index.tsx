import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Form, Input, Space, Card } from 'antd';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { Notification } from '../../components';
import { API_URL } from '../../constants';

interface AccountRegister {
    user_email: string;
    user_name: string;
    user_pass: string;
}

const initialValues = {
    user_email: '',
    user_name: '',
    user_pass: ''
}

const validationSchema = yup.object({
    user_email: yup.string()
        .email('Invalid user_email format')
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Invalid user_email format. Must include domain.')
        .required('user_email must exist')
        .min(10),
    user_name: yup.string().required('user_name must exist'),
    user_pass: yup.string().required('user_pass must exist')
})

const Register: React.FC = () => {

    const navigate = useNavigate();

    async function postRegisterData(values: AccountRegister) {
        console.log(values)
        try {
            const fetching = await fetch(API_URL + '/register', {
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
                    name="user_email"
                    hasFeedback
                    validateStatus={formik.touched.user_email && formik.errors.user_email ? 'error' : 'success'}
                    help={formik.touched.user_email && formik.errors.user_email ? formik.errors.user_email : ''}
                >
                    <>
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="user_email"
                            value={formik.values.user_email}
                            onChange={formik.handleChange('user_email')}
                        />
                    </>

                </Form.Item>
                <Form.Item
                    name="user_name"
                    rules={[{ required: true, message: 'Please input your user_name!' }]}
                >
                    <Input
                        prefix={<UserOutlined className="site-form-item-icon" />}
                        placeholder="user_name"
                        value={formik.values.user_name}
                        onChange={formik.handleChange('user_name')}
                        status={formik.errors.user_name && 'error'}
                    />
                </Form.Item>
                <Form.Item
                    name="user_pass"
                    hasFeedback
                    validateStatus={formik.touched.user_pass && formik.errors.user_pass ? 'error' : 'success'}
                    help={formik.touched.user_pass && formik.errors.user_pass ? formik.errors.user_pass : ''}
                >
                    <Input
                        prefix={<LockOutlined className="site-form-item-icon" />}
                        type="user_pass"
                        placeholder="user_pass"
                        value={formik.values.user_pass}
                        onChange={formik.handleChange('user_pass')}
                        status={formik.errors.user_pass && 'error'}
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