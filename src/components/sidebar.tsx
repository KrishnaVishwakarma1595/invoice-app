import React from 'react';

const Sidebar = () => {

    const [theme, setTheme] = React.useState<string>('light');

    const handleThemeSwitch = () => {
        const _theme = theme === 'light' ? "dark" : "light";
        document.body.dataset.theme = _theme;
        localStorage.setItem('theme', _theme);
        setTheme(_theme);
    }

    React.useEffect(() => {
        const _theme = localStorage.getItem('theme');        
        if(_theme) {
            setTheme(_theme);
            document.body.dataset.theme = _theme;
        }
        else localStorage.setItem('theme', "light");
    }, [])

    return (
        <div id='invoice-sidebar'>
            <div className='logo-container'>
                <img src='/logo.svg' alt='logo' width={40} height={40} style={{ objectFit: 'contain', zIndex: 1 }} />
            </div>
            <div className='sidebar-bottom'>
                <img src={theme === 'dark' ? '/icon-sun.svg' : '/icon-moon.svg'} alt='' onClick={handleThemeSwitch} 
                style={{ cursor: 'pointer'}} />
                <hr style={{ width: '100%', borderColor: 'var(--slatty)', margin: '32px 0px 24px 0px' }} />
                <img src='/image-avatar.jpg' alt='User' style={{
                    width: 40, height: 40, borderRadius: '50%'
                }} />
            </div>
        </div>
    );
}

export default Sidebar;