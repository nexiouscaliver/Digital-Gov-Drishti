from setuptools import find_packages, setup

setup(
    name='corruption_complaint_system',
    version='1.0.0',
    packages=find_packages(),
    include_package_data=True,
    install_requires=[
        'Flask',
        'Flask-Cors',
        'pymongo',
        'python-dotenv',
        'bcrypt',
        'PyJWT',
        'email-validator',
        'python-dateutil',
        'pytest',
        'pytest-flask',
        'gunicorn',
    ],
    python_requires='>=3.8',
    description='Corruption Complaint System Backend API',
    author='Digital-Gov-Drishti Team',
) 