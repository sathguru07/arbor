import 'dart:async';
import 'dart:convert';
import 'dart:math';
import 'package:web_socket_channel/web_socket_channel.dart';
import 'package:flutter/foundation.dart';
import '../core/protocol.dart';

class WebSocketService {
  WebSocketChannel? _channel;
  final StreamController<BroadcastMessage> _controller = StreamController.broadcast();
  bool _isConnected = false;
  bool _isDisposed = false;

  Stream<BroadcastMessage> get messageStream => _controller.stream;
  bool get isConnected => _isConnected;

  Future<void> connect(String url) async {
    if (_isConnected) return;
    
    int retryCount = 0;
    while (!_isConnected && !_isDisposed) {
      try {
        debugPrint('Connecting to $url...');
        final uri = Uri.parse(url);
        _channel = WebSocketChannel.connect(uri);
        await _channel!.ready;
        _isConnected = true;
        retryCount = 0;
        debugPrint('Connected to Arbor Server');

        _channel!.stream.listen(
          (message) {
            _handleMessage(message);
          },
          onDone: () {
            debugPrint('WebSocket connection closed');
            _isConnected = false;
            _reconnect(url);
          },
          onError: (error) {
            debugPrint('WebSocket error: $error');
            _isConnected = false;
            _reconnect(url);
          },
        );
      } catch (e) {
        debugPrint('Connection failed: $e');
        _isConnected = false;
        await _backoff(retryCount++);
      }
    }
  }

  Future<void> _reconnect(String url) async {
    if (_isDisposed) return;
    _channel = null;
    await _backoff(0);
    connect(url);
  }

  Future<void> _backoff(int retryCount) async {
    if (_isDisposed) return;
    final delay = min(30, pow(2, retryCount).toInt());
    debugPrint('Retrying in $delay seconds...');
    await Future.delayed(Duration(seconds: delay));
  }

  void _handleMessage(dynamic message) {
    try {
      if (message is String) {
        final json = jsonDecode(message);
        // Check if it matches BroadcastMessage structure
        if (json is Map<String, dynamic> && json.containsKey('type') && json.containsKey('payload')) {
           final broadcast = BroadcastMessage.fromJson(json);
           _controller.add(broadcast);
        } else {
           // Might be a standard JSON-RPC response, ignore for now or log
           // debugPrint('Ignored message: $message');
        }
      }
    } catch (e) {
      debugPrint('Error parsing message: $e');
    }
  }

  void dispose() {
    _isDisposed = true;
    _channel?.sink.close();
    _controller.close();
  }
}
