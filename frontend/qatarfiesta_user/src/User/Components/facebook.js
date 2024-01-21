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
                client_id: 'Mw2K1CoKaSkD1qzNS1M2XnxqCLiAimp78yG4tfy5',
                client_secret: '2F1tOGhmJWNau1BrYPCrfZfcLhEUFjx3a5QnQsj5JZbenWpBsGudILMxRuARU5ZWeMo1uci26w6AxnNr2aN3cHBjYeWCvYpK2ZkU2B1ftHcqeHcmfhbfrexwt6aGTSYI',
                
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
