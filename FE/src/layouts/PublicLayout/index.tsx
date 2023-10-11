import { Outlet } from 'react-router-dom'
import { Footer, Navbar } from '../../components';
import { Affix, Layout, Space } from 'antd';

const PublicLayout = () => {

    return (
        <Layout style={{ width: '100%', height: '100%', background: 'teal' }}>
            <Affix offsetTop={0}>
                < Navbar />
            </Affix>
            <Space direction="horizontal" style={{ height: '84vh', justifyContent: 'center', alignContent: 'center' }}>
                < Outlet />
            </Space>
            <Affix offsetBottom={0}>
                < Footer />
            </Affix>
        </Layout>
    )
}

export default PublicLayout