import { Button, Form, Input, Space, Card, Select } from 'antd';
import { useNavigate } from 'react-router-dom';
import * as yup from 'yup';
import { useContext } from 'react';
import { useFormik } from 'formik';
import { AppContext } from '../../Provider/AppProvider';
import { Notification } from '../../components'
import { useTokenChecker } from '../../hooks';


interface AccountLogin {
    name: string;
    is_active: string;
}

const initialValues = {
    name: '',
    is_active: ''
}

const AddItem: React.FC = () => {

    const navigate = useNavigate();
    const { isNameUnique} = useContext(AppContext);
    const token = localStorage.getItem('token')

    useTokenChecker(token)
    
    const handleSubmit = async (values: AccountLogin) => {
        console.log("submit")
        try {
            const fetching = await fetch('https://mock-api.arikmpt.com/api/category/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(values)
            });
            console.log("submit inside")

            if (!fetching.ok) {
                throw new Error('Error adding category');
            }
            Notification('success', 'Add Category', 'Data successfully added');
            navigate('/');
        } catch (error) {
            console.error('Error adding data:', error);
        }
    }

    const nameUniquenessValidation = async (name: string) => {
        return isNameUnique(name);
    };

    const validationSchema = yup.object({
        name: yup
            .string()
            .required('Name must exist')
            .test('is-unique', 'Name must be unique', 
            async function (value) {
                if (!value) return false;
                const isUnique = await nameUniquenessValidation(value);
                return isUnique;
            }),
        is_active: yup.string().required('Select one of the status'),
    });

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: validationSchema,
    })

    return (
        <Card title="Add New Category" headStyle={{ textAlign: 'center' }}>
            <a onClick={() => { navigate('/') }}>Back to Main Page</a>
            <Form onFinish={formik.handleSubmit}>
                <Form.Item
                    name="name"
                    hasFeedback
                    validateStatus={formik.touched.name && formik.errors.name ? 'error' : 'success'}
                    help={formik.touched.name && formik.errors.name ? formik.errors.name : ''}
                >
                    <Input
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange('name')}
                        status={formik.errors.name && 'error'}
                    />
                </Form.Item>
                <Form.Item
                    name="status"
                    rules={[{ required: true, message: 'Select one of the status' }]}
                >
                    <Select
                        data-testid="status-select"
                        placeholder="Status"
                        value={formik.values.is_active}
                        onChange={formik.handleChange('is_active')}
                        status={formik.errors.is_active && 'error'}
                    >
                        <Select.Option value="true">Active</Select.Option>
                        <Select.Option value="false">Deactive</Select.Option>
                    </Select>
                </Form.Item>
                <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent: 'space-around', width: "100%" }}>
                    <Button type="primary" htmlType="submit" style={{ width: "200px" }}>
                        Submit
                    </Button>
                </Space>
            </Form>
        </Card>
    );
};

export default AddItem;