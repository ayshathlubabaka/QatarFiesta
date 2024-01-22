const facebook = async(accessToken) => {
    console.log('accessToken',accessToken);
    try {
        const response = await fetch('http://127.0.0.1:8000/auth/convert-token/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
        },
            body: JSON.stringify({
                token: accessToken,
                backend: 'facebook',
                grant_type: 'convert_token',
                client_id: 'FACEBOOK_CLIENT_SECRET',
                client_secret: 'FACEBOOK_CLIENT_ID',
                
            }),
        });

        if (response.ok && response.status === 200) {
            const responseData = await response.json();
            localStorage.setItem('access_token', responseData.access_token);
            localStorage.setItem('refresh_token', responseData.refresh_token);
        } else {
            alert('User not found');
        }
    } catch (error) {
        alert('Error during login!', error);
    }
}

export default facebook
