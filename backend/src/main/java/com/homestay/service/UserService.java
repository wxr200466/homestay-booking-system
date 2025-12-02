package com.homestay.service;

import com.homestay.common.ApiResponse;
import com.homestay.dto.LoginDTO;
import com.homestay.dto.RegisterDTO;
import org.springframework.web.multipart.MultipartFile;

public interface UserService {
    
    // 用户注册
    ApiResponse<?> register(RegisterDTO registerDTO);
    
    // 用户登录
    ApiResponse<?> login(LoginDTO loginDTO);
    
    // 获取用户信息
    ApiResponse<?> getUserInfo(Long userId);
    
    // 更新用户信息
    ApiResponse<?> updateUserInfo(Long userId, Object updateData);
    
    // 修改密码
    ApiResponse<?> changePassword(Long userId, String oldPassword, String newPassword);
    
    // 上传头像
    ApiResponse<?> uploadAvatar(Long userId, MultipartFile file);
    
    // 实名认证
    ApiResponse<?> realNameAuth(Long userId, Object authData);
    
    // 获取验证码
    ApiResponse<?> getCaptcha(String phone);
    
    // 忘记密码
    ApiResponse<?> forgotPassword(String email);
    
    // 重置密码
    ApiResponse<?> resetPassword(String email, String code, String newPassword);
}
