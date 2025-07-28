## 🚀 Live Demo

🎯 Try out the Tourly (Travel Booking System) in real time! Developed by JAVA FULL STACK..............✨

🔗 **Frontend** (User Interface):  
[🌐 Open Live Site](https://tourly-uday.netlify.app/)


# BACK END FOR TOURLY FULL STACK PROJECT
# Admin Module

Admin
package com.Springbootpace.SpringBoot.Entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}

    // Getters and setters
}

AdminRepository
package com.Springbootpace.SpringBoot.Repositary;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

import com.Springbootpace.SpringBoot.Entity.Admin;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
}

AdminService
package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.Admin;

public interface AdminService {
    boolean validateLogin(String email, String password);
    
    Admin findByEmail(String email); 
}

AdminServiceImpl
package com.Springbootpace.SpringBoot.Service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.Springbootpace.SpringBoot.Entity.Admin;
import com.Springbootpace.SpringBoot.Repositary.AdminRepository;

@Service
public class AdminServiceImpl implements AdminService {
    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public boolean validateLogin(String email, String password) {
        Optional<Admin> admin = adminRepository.findByEmail(email);
        return admin.isPresent() && passwordEncoder.matches(password, admin.get().getPassword());
    }
    
    @Override
    public Admin findByEmail(String email) {
        return adminRepository.findByEmail(email).orElse(null);
    }
}

AdminController
package com.Springbootpace.SpringBoot.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.Springbootpace.SpringBoot.Entity.*;
import com.Springbootpace.SpringBoot.Service.*;
import com.Springbootpace.SpringBoot.dto.LoginRequest;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private HotelBookingService hotelService;

    @Autowired
    private CabBookingService cabService;

    @Autowired
    private FlightBookingService flightService;

    @Autowired
    private TouristBookingService touristService;

    @Autowired
    private UserService userService;
    
    @Autowired
    private ContactMessageService contactMessageService;


    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequest request) {
        Admin admin = adminService.findByEmail(request.getEmail());
        Map<String, String> response = new HashMap<>();

        if (admin != null && passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            response.put("message", "Login Successful");
            response.put("role", "ADMIN");
            response.put("email", admin.getEmail());
            return ResponseEntity.ok(response);
        } else {
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/hotels")
    public List<HotelBooking> getAllHotelBookings() {
        return hotelService.getAllBookings();
    }

    @GetMapping("/cabs")
    public List<CabBooking> getAllCabBookings() {
        return cabService.getAllBookings();
    }

    @GetMapping("/flights")
    public List<FlightBooking> getAllFlightBookings() {
        return flightService.getAllBookings();
    }
    
    @GetMapping("/tourist")
    public List<TouristBooking> getAllTouristBookings() {
        return touristService.getAllBookings();
    }
    
    @GetMapping("/contact")
    public List<ContactMessage> getAllContactMessages() {
        return contactMessageService.getAllMessages();
    }

}


# Contact Us Module

ContactMessage
package com.Springbootpace.SpringBoot.Entity;

import jakarta.persistence.*;



@Entity
@Table(name = "contact_us")
public class ContactMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String email;
    private String subject;
    
    @Column(length = 1000)
    private String message;
    
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getSubject() { return subject; }
    public void setSubject(String subject) { this.subject = subject; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
  
}


ContactMessageRepository

package com.Springbootpace.SpringBoot.Repositary;

import com.Springbootpace.SpringBoot.Entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {
}

ContactMessageService
package com.Springbootpace.SpringBoot.Service;


import java.util.List;

import com.Springbootpace.SpringBoot.Entity.ContactMessage;
public interface ContactMessageService {
    ContactMessage saveMessage(ContactMessage message);
    
    List<ContactMessage> getAllMessages();

}
ContactMessageServiceImpl
package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.ContactMessage;
import com.Springbootpace.SpringBoot.Repositary.ContactMessageRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactMessageServiceImpl implements ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessagerepository;

    @Override
    public ContactMessage saveMessage(ContactMessage message) {
        return contactMessagerepository.save(message);
    }
    
    @Override
    public List<ContactMessage> getAllMessages() {
        return contactMessagerepository.findAll();
    }
}
ContactController
package com.Springbootpace.SpringBoot.Controller;

import com.Springbootpace.SpringBoot.Entity.ContactMessage;
import com.Springbootpace.SpringBoot.Service.ContactMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*")
public class ContactController {

    @Autowired
    private ContactMessageService service;

    @PostMapping("/submit")
    public ContactMessage submitMessage(@RequestBody ContactMessage message) {
        return service.saveMessage(message);
    }
    
 // ✅ Admin endpoint to view all messages
    @GetMapping("/all")
    public List<ContactMessage> getAllMessages() {
        return service.getAllMessages();
    }

}






# Cabs Module

CabBooking
package com.Springbootpace.SpringBoot.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cab_bookings")
public class CabBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String cabType;
    private String pickup;
    private String dropLocation;
    private int travellers;
    private double totalPrice;
    private String travelDate;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getCabType() { return cabType; }
    public void setCabType(String cabType) { this.cabType = cabType; }

    public String getPickup() { return pickup; }
    public void setPickup(String pickup) { this.pickup = pickup; }

    public String getDropLocation() { return dropLocation; }
    public void setDropLocation(String dropLocation) { this.dropLocation = dropLocation; }

    public int getTravellers() { return travellers; }
    public void setTravellers(int travellers) { this.travellers = travellers; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
    
    public String getTravelDate() {
        return travelDate;
    }

    public void setTravelDate(String travelDate) {
        this.travelDate = travelDate;
    }
}

CabBookingRepository
package com.Springbootpace.SpringBoot.Repositary;

import com.Springbootpace.SpringBoot.Entity.CabBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CabBookingRepository extends JpaRepository<CabBooking, Long> {
    List<CabBooking> findByUserId(Long userId);
}

CabBookingService
package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.CabBooking;
import java.util.List;

public interface CabBookingService {
    CabBooking saveBooking(CabBooking booking);
    List<CabBooking> getAllBookings();
    List<CabBooking> getBookingsByUserId(Long userId);
    
    void deleteBooking(Long id);


}
CabBookingServiceImpl
package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.CabBooking;
import com.Springbootpace.SpringBoot.Repositary.CabBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CabBookingServiceImpl implements CabBookingService {

    @Autowired
    private CabBookingRepository cabBookingRepository;

    @Override
    public CabBooking saveBooking(CabBooking booking) {
        return cabBookingRepository.save(booking);
    }

    @Override
    public List<CabBooking> getAllBookings() {
        return cabBookingRepository.findAll();
    }

    @Override
    public List<CabBooking> getBookingsByUserId(Long userId) {
        return cabBookingRepository.findByUserId(userId);
    }
    
    @Override
    public void deleteBooking(Long id) {
        if (!cabBookingRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Cab booking not found");
        }
        cabBookingRepository.deleteById(id);
    }
}

CabBookingController
package com.Springbootpace.SpringBoot.Controller;

import com.Springbootpace.SpringBoot.Entity.CabBooking;
import com.Springbootpace.SpringBoot.Service.CabBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cabs")
@CrossOrigin(origins = "*")
public class CabBookingController {

    @Autowired
    private CabBookingService cabBookingService;

    @PostMapping("/book")
    public CabBooking bookCab(@RequestBody CabBooking booking) {
        return cabBookingService.saveBooking(booking);
    }

    @GetMapping("/user/{userId}")
    public List<CabBooking> getBookingsByUser(@PathVariable Long userId) {
        return cabBookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/all")
    public List<CabBooking> getAllBookings() {
        return cabBookingService.getAllBookings();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        cabBookingService.deleteBooking(id);
        return ResponseEntity.ok("Cab booking deleted successfully");
    }
}




# Flight Module


FlightBooking

package com.Springbootpace.SpringBoot.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "flight_bookings")
public class FlightBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String airline;
    private String fromLocation;
    private String toLocation;
    private String date;
    private int travellers;
    private double totalPrice;
    
    
    public String getDate() { return date; }
	public void setDate(String date) { this.date = date; }
	

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getAirline() { return airline; }
    public void setAirline(String airline) { this.airline = airline; }

    public String getFromLocation() { return fromLocation; }
    public void setFromLocation(String fromLocation) { this.fromLocation = fromLocation; }

    public String getToLocation() { return toLocation; }
    public void setToLocation(String toLocation) { this.toLocation = toLocation; }

    public int getTravellers() { return travellers; }
    public void setTravellers(int travellers) { this.travellers = travellers; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}


FlightBookingRepository

package com.Springbootpace.SpringBoot.Repositary;

import com.Springbootpace.SpringBoot.Entity.FlightBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FlightBookingRepository extends JpaRepository<FlightBooking, Long> {
    List<FlightBooking> findByUserId(Long userId);
}

FlightBookingService

package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.FlightBooking;
import java.util.List;

public interface FlightBookingService {
    FlightBooking saveBooking(FlightBooking booking);
    List<FlightBooking> getAllBookings();
    List<FlightBooking> getBookingsByUserId(Long userId);
    
    void deleteBooking(Long id);


}
FlightBookingServiceImpl

package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.FlightBooking;
import com.Springbootpace.SpringBoot.Repositary.FlightBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightBookingServiceImpl implements FlightBookingService {

    @Autowired
    private FlightBookingRepository flightBookingRepository;

    @Override
    public FlightBooking saveBooking(FlightBooking booking) {
        return flightBookingRepository.save(booking);
    }

    @Override
    public List<FlightBooking> getAllBookings() {
        return flightBookingRepository.findAll();
    }

    @Override
    public List<FlightBooking> getBookingsByUserId(Long userId) {
        return flightBookingRepository.findByUserId(userId);
    }
    @Override
    public void deleteBooking(Long id) {
        flightBookingRepository.deleteById(id);
    }
}


FlightBookingControlller

package com.Springbootpace.SpringBoot.Controller;
import com.Springbootpace.SpringBoot.Entity.FlightBooking;
import com.Springbootpace.SpringBoot.Service.FlightBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/flights")
@CrossOrigin(origins = "*")
public class FlightBookingController {

    @Autowired
    private FlightBookingService flightBookingService;

    @PostMapping("/book")
    public FlightBooking bookFlight(@RequestBody FlightBooking booking) {
        return flightBookingService.saveBooking(booking);
    }

    @GetMapping("/user/{userId}")
    public List<FlightBooking> getBookingsByUser(@PathVariable Long userId) {
        return flightBookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/all")
    public List<FlightBooking> getAllBookings() {
        return flightBookingService.getAllBookings();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        flightBookingService.deleteBooking(id);
        return ResponseEntity.ok("Hotel booking deleted successfully");
    }
}






# Hotel Module
HotelBooking

package com.Springbootpace.SpringBoot.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "hotel_bookings")
public class HotelBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String hotelName;
    private int persons;
    private String date;
    private int days;
	private double totalPrice;

    // Getters and Setters
	public String getDate() { return date; }
	public void setDate(String date) { this.date = date; }
	
	
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getHotelName() { return hotelName; }
    public void setHotelName(String hotelName) { this.hotelName = hotelName; }

    public int getPersons() { return persons; }
    public void setPersons(int persons) { this.persons = persons; }

    public int getDays() { return days; }
    public void setDays(int days) { this.days = days; }

    public double getTotalPrice() { return totalPrice; }
    public void setTotalPrice(double totalPrice) { this.totalPrice = totalPrice; }
}


HotelBookingRepository
package com.Springbootpace.SpringBoot.Repositary;

import com.Springbootpace.SpringBoot.Entity.CabBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CabBookingRepository extends JpaRepository<CabBooking, Long> {
    List<CabBooking> findByUserId(Long userId);
}



HotelBookingService
package com.Springbootpace.SpringBoot.Service;



import java.util.List;
import com.Springbootpace.SpringBoot.Entity.HotelBooking;

public interface HotelBookingService {

    // Save hotel booking
    HotelBooking saveBooking(HotelBooking booking);

    // Get all bookings
    List<HotelBooking> getAllBookings();

    // Get bookings by user ID
    List<HotelBooking> getBookingsByUserId(Long userId);

    
    void deleteBooking(Long id);


}
HotelBookingServiceImpl
package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.FlightBooking;
import com.Springbootpace.SpringBoot.Repositary.FlightBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FlightBookingServiceImpl implements FlightBookingService {

    @Autowired
    private FlightBookingRepository flightBookingRepository;

    @Override
    public FlightBooking saveBooking(FlightBooking booking) {
        return flightBookingRepository.save(booking);
    }

    @Override
    public List<FlightBooking> getAllBookings() {
        return flightBookingRepository.findAll();
    }

    @Override
    public List<FlightBooking> getBookingsByUserId(Long userId) {
        return flightBookingRepository.findByUserId(userId);
    }
    @Override
    public void deleteBooking(Long id) {
        flightBookingRepository.deleteById(id);
    }
}





HotelBookingController
package com.Springbootpace.SpringBoot.Controller;



import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Springbootpace.SpringBoot.Entity.HotelBooking;
import com.Springbootpace.SpringBoot.Service.HotelBookingService;
import java.util.List;

@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelBookingController {

    @Autowired
    private HotelBookingService hotelBookingService;

    @PostMapping("/book")
    public HotelBooking bookHotel(@RequestBody HotelBooking booking) {
        return hotelBookingService.saveBooking(booking);
    }

    @GetMapping("/user/{userId}")
    public List<HotelBooking> getBookingsByUser(@PathVariable Long userId) {
        return hotelBookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/all")
    public List<HotelBooking> getAllBookings() {
        return hotelBookingService.getAllBookings();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        hotelBookingService.deleteBooking(id);
        return ResponseEntity.ok("Hotel booking deleted successfully");
    }

}








# Tourist Module

TouristBooking
package com.Springbootpace.SpringBoot.Entity;

import jakarta.persistence.*;

@Entity
@Table(name = "tourist_bookings")
public class TouristBooking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;
    private String name;
    private String place;
    private String date;
    private int days;
    private int travellers;
    private double totalCost;
    
    
    public int getDays() { return days; }
	public void setDays(int days) { this.days = days; }

    public String getDate() { return date; }
	public void setDate(String date) { this.date = date; }
	// Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPlace() { return place; }
    public void setPlace(String place) { this.place = place; }

    public int getTravellers() { return travellers; }
    public void setTravellers(int travellers) { this.travellers = travellers; }


    public double getTotalCost() { return totalCost; }
    public void setTotalCost(double totalCost) { this.totalCost = totalCost; }
}

TouristBookingRepositroy
package com.Springbootpace.SpringBoot.Repositary;

import com.Springbootpace.SpringBoot.Entity.TouristBooking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TouristBookingRepository extends JpaRepository<TouristBooking, Long> {
    List<TouristBooking> findByUserId(Long userId);
}
TouristBookingService
package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.TouristBooking;
import java.util.List;

public interface TouristBookingService {
    TouristBooking saveBooking(TouristBooking booking);
    List<TouristBooking> getAllBookings();
    List<TouristBooking> getBookingsByUserId(Long userId);
    
    void deleteBooking(Long id);

}
TouristBookingServiceImpl

package com.Springbootpace.SpringBoot.Service;

import com.Springbootpace.SpringBoot.Entity.ContactMessage;
import com.Springbootpace.SpringBoot.Repositary.ContactMessageRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ContactMessageServiceImpl implements ContactMessageService {

    @Autowired
    private ContactMessageRepository contactMessagerepository;

    @Override
    public ContactMessage saveMessage(ContactMessage message) {
        return contactMessagerepository.save(message);
    }
    
    @Override
    public List<ContactMessage> getAllMessages() {
        return contactMessagerepository.findAll();
    }


}

TouristBookingController

package com.Springbootpace.SpringBoot.Controller;

import com.Springbootpace.SpringBoot.Entity.TouristBooking;
import com.Springbootpace.SpringBoot.Service.TouristBookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tourist")
@CrossOrigin(origins = "*")
public class TouristBookingController {

    @Autowired
    private TouristBookingService touristBookingService;

    @PostMapping("/book")
    public TouristBooking bookTourist(@RequestBody TouristBooking booking) {
        return touristBookingService.saveBooking(booking);
    }

    @GetMapping("/user/{userId}")
    public List<TouristBooking> getBookingsByUser(@PathVariable Long userId) {
        return touristBookingService.getBookingsByUserId(userId);
    }

    @GetMapping("/all")
    public List<TouristBooking> getAllBookings() {
        return touristBookingService.getAllBookings();
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteBooking(@PathVariable Long id) {
        touristBookingService.deleteBooking(id);
        return ResponseEntity.ok("Hotel booking deleted successfully");
    }
}
